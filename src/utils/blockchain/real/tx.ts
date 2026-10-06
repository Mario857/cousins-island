import type { Coin } from '@cosmjs/amino'
import type { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate'
import { toUtf8 } from '@cosmjs/encoding'
import { TimeoutError as BroadcastTimeoutError, type DeliverTxResponse, type Event } from '@cosmjs/stargate'
import { getNetwork } from 'config/networks'
import type { TxReceipt, TxResult } from '../blockchain.interface'
import { formatCoins } from './amounts'
import { errorMessage, getTx } from './chain'
import { requireSession } from './wallet-session'

export interface ExecuteMsg {
	contractAddress: string
	msg: Record<string, unknown>
	funds?: Coin[]
}

/** Fee simulation gets this multiplier on top of the simulated gas. */
const GAS_MULTIPLIER = 1.4

export function toExecuteEncodeObject(sender: string, m: ExecuteMsg): MsgExecuteContractEncodeObject {
	return {
		typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
		value: {
			sender,
			contract: m.contractAddress,
			msg: toUtf8(JSON.stringify(m.msg)),
			funds: [...(m.funds ?? [])],
		},
	}
}

/** Base64 JSON for cw721 `send_nft` hooks. */
export function encodeHookMsg(msg: Record<string, unknown>): string {
	const json = JSON.stringify(msg)
	const bytes = toUtf8(json)
	let binary = ''
	bytes.forEach(b => (binary += String.fromCharCode(b)))
	return btoa(binary)
}

/** The fee actually paid, from the `tx` event's `fee` attribute (e.g. "4523uluna"). */
export function feeFromEvents(events: readonly Event[] | undefined): Coin[] | undefined {
	if (!events) return undefined
	for (const event of events) {
		if (event.type !== 'tx') continue
		const fee = event.attributes.find(a => a.key === 'fee')?.value
		if (fee === undefined) continue
		if (fee === '') return []
		return fee
			.split(',')
			.map(part => part.trim().match(/^(\d+)([a-zA-Z][a-zA-Z0-9/:._-]*)$/))
			.filter((m): m is RegExpMatchArray => Boolean(m))
			.map(m => ({ amount: m[1], denom: m[2] }))
	}
	return undefined
}

/** Turns wallet/chain errors into something a user can act on. */
export function friendlyTxError(e: unknown): Error {
	const raw = errorMessage(e)
	const msg = raw.toLowerCase()
	if (/request rejected|user rejected|rejected by user|user denied|cancel+ed by user|user cancel+ed/.test(msg)) {
		return new Error('Transaction rejected in the wallet')
	}
	if (/insufficient funds|insufficient fee|spendable balance .* is smaller than/.test(msg)) {
		return new Error('Not enough LUNA to pay for this transaction and its fee')
	}
	if (/account .* not found|does not exist on chain/.test(msg)) {
		return new Error('Your account has no funds yet: send some LUNA to it first')
	}
	if (/out of gas/.test(msg)) {
		return new Error('The transaction ran out of gas, please try again')
	}
	// Contract errors arrive as "...execute wasm contract failed: <reason>: execute wasm contract failed [...]"
	const contract = raw.match(/(?:failed to execute message; message index: \d+: )?([^:]+?): execute wasm contract failed/)
	if (contract) return new Error(contract[1].trim())
	const generic = raw.match(/Generic error: ([^:]+)/)
	if (generic) return new Error(generic[1].trim())
	const wrapped = raw.match(/message index: \d+: (.+?)(?:: (?:unknown request|invalid request|execute wasm contract failed))?(?: \[|$)/)
	if (wrapped) return new Error(wrapped[1].trim())
	return e instanceof Error ? e : new Error(raw)
}

export function receiptFromResult(result: Pick<DeliverTxResponse, 'transactionHash' | 'events'>): TxReceipt {
	const fee = feeFromEvents(result.events)
	return {
		txId: result.transactionHash,
		txTerraFinderUrl: getNetwork().explorerTx(result.transactionHash),
		txFee: fee ? formatCoins(fee) : '~0.02 LUNA',
	}
}

// signAndBroadcast only resolves once the tx is in a block, so we already know
// the outcome; getTxResult answers from here without another RPC round trip.
const knownResults = new Map<string, TxResult>()

function remember(result: Pick<DeliverTxResponse, 'transactionHash' | 'height' | 'code' | 'rawLog'>) {
	knownResults.set(result.transactionHash, {
		data: {
			txhash: result.transactionHash,
			height: result.height,
			code: result.code,
			logs: result.code === 0 ? [{ msg_index: 0 }] : [],
			rawLog: result.rawLog,
		},
	})
	if (knownResults.size > 50) knownResults.delete(knownResults.keys().next().value!)
}

/** Signs and broadcasts one or more contract executions in a single transaction. */
export async function executeContracts(msgs: ExecuteMsg[], memo = ''): Promise<TxReceipt> {
	if (msgs.length === 0) throw new Error('Nothing to execute')
	const session = requireSession('send transactions')
	let result: DeliverTxResponse
	try {
		const client = await session.getSigningClient()
		const encoded = msgs.map(m => toExecuteEncodeObject(session.address, m))
		result = await client.signAndBroadcast(session.address, encoded, GAS_MULTIPLIER, memo)
	} catch (e) {
		// Broadcast went through but the block didn't show up in time: let the UI keep polling.
		if (e instanceof BroadcastTimeoutError && e.txId) {
			return {
				txId: e.txId,
				txTerraFinderUrl: getNetwork().explorerTx(e.txId),
				txFee: '~0.02 LUNA',
			}
		}
		throw friendlyTxError(e)
	}
	if (result.code !== 0) {
		throw friendlyTxError(result.rawLog || `Transaction failed with code ${result.code}`)
	}
	remember(result)
	return receiptFromResult(result)
}

export function executeContract(msg: ExecuteMsg, memo?: string): Promise<TxReceipt> {
	return executeContracts([msg], memo)
}

/**
 * Looks a tx up by hash. Returns null until it's in a block. The shape is what
 * hooks/useBroadcastingTx checks: `data.logs` is non-empty only on success.
 */
export async function getTxResult(txHash: string): Promise<TxResult | null> {
	const known = knownResults.get(txHash)
	if (known) return known
	let tx
	try {
		tx = await getTx(txHash)
	} catch (e) {
		// Transient RPC errors: report "not found yet" so the caller keeps polling.
		console.warn(`Tx lookup for ${txHash} failed: ${errorMessage(e)}`)
		return null
	}
	if (!tx) return null
	return {
		data: {
			txhash: tx.hash,
			height: tx.height,
			code: tx.code,
			logs: tx.code === 0 ? [{ msg_index: 0 }] : [],
			rawLog: tx.rawLog,
		},
	}
}
