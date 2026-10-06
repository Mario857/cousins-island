import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import {
	Comet1Client,
	Comet38Client,
	CometClient,
	HttpBatchClient,
	HttpClient,
	RpcClient,
	Tendermint37Client,
} from '@cosmjs/tendermint-rpc'
import { getNetwork, NetworkConfig } from 'config/networks'

// Read-only access to the chain over CometBFT RPC. Several endpoints are
// configured per network; the first one that answers is cached and used until
// it fails, then the next one is tried. Requests are sent as JSON-RPC batches,
// which matters when a collection page loads hundreds of `nft_info` queries.

const HTTP_TIMEOUT_MS = 10_000
const CONNECT_TIMEOUT_MS = 8_000
const QUERY_TIMEOUT_MS = 20_000

/** Every RPC endpoint of the network failed to connect. */
export class RpcUnavailableError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'RpcUnavailableError'
	}
}

export class TimeoutError extends Error {
	constructor(what: string, ms: number) {
		super(`${what} timed out after ${ms / 1000}s`)
		this.name = 'TimeoutError'
	}
}

export function withTimeout<T>(promise: Promise<T>, ms: number, what = 'Request'): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new TimeoutError(what, ms)), ms)
	})
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

export function errorMessage(e: unknown): string {
	if (e instanceof Error) return e.message
	if (typeof e === 'string') return e
	try {
		return JSON.stringify(e)
	} catch {
		return String(e)
	}
}

/** Like cosmjs' `connectComet`, but on an RPC client we choose (batching, timeouts). */
async function connectComet(makeRpc: () => RpcClient): Promise<CometClient> {
	const tm37 = Tendermint37Client.create(makeRpc())
	const version = (await tm37.status()).nodeInfo.version
	if (version.startsWith('0.38.')) {
		tm37.disconnect()
		return Comet38Client.create(makeRpc())
	}
	if (version.startsWith('1.')) {
		tm37.disconnect()
		return Comet1Client.create(makeRpc())
	}
	return tm37
}

async function connectEndpoint(url: string): Promise<CosmWasmClient> {
	const batched = () =>
		new HttpBatchClient(url, { batchSizeLimit: 20, dispatchInterval: 20, httpTimeout: HTTP_TIMEOUT_MS })
	const plain = () => new HttpClient(url, HTTP_TIMEOUT_MS)
	try {
		return CosmWasmClient.create(await withTimeout(connectComet(batched), CONNECT_TIMEOUT_MS, `Connecting to ${url}`))
	} catch (e) {
		// A node that doesn't answer won't answer the second time either.
		if (e instanceof TimeoutError) throw e
		// Some nodes/proxies reject JSON-RPC batches; try one request at a time.
		return CosmWasmClient.create(await withTimeout(connectComet(plain), CONNECT_TIMEOUT_MS, `Connecting to ${url}`))
	}
}

interface ClientState {
	chainId: string
	/** Index in network.rpc of the endpoint in use (or being tried first). */
	index: number
	client: Promise<CosmWasmClient>
}

let state: ClientState | null = null

async function connectFrom(network: NetworkConfig, startIndex: number): Promise<{ client: CosmWasmClient; index: number }> {
	const urls = network.rpc
	if (urls.length === 0) throw new Error(`No RPC endpoints configured for ${network.chainId}`)
	const errors: string[] = []
	for (let i = 0; i < urls.length; i++) {
		const index = (startIndex + i) % urls.length
		try {
			return { client: await connectEndpoint(urls[index]), index }
		} catch (e) {
			errors.push(`${urls[index]}: ${errorMessage(e)}`)
		}
	}
	throw new RpcUnavailableError(`Could not reach any ${network.name} RPC node (${errors.join('; ')})`)
}

/** After every endpoint failed, fail fast for a moment instead of retrying them all on each call. */
const DOWN_COOLDOWN_MS = 15_000
let downUntil: { chainId: string; until: number; error: Error } | null = null

function startConnecting(network: NetworkConfig, startIndex: number): ClientState {
	const pending = connectFrom(network, startIndex)
	const next: ClientState = { chainId: network.chainId, index: startIndex, client: pending.then(r => r.client) }
	pending.then(
		r => {
			if (state === next) next.index = r.index
			downUntil = null
		},
		e => {
			// Don't keep a failed connection; after a short cooldown the next call tries all endpoints again.
			if (state === next) state = null
			downUntil = { chainId: network.chainId, until: Date.now() + DOWN_COOLDOWN_MS, error: e }
		}
	)
	return next
}

/** The cached read-only client for the current network. */
export function getQueryClient(): Promise<CosmWasmClient> {
	const network = getNetwork()
	if (downUntil && downUntil.chainId === network.chainId && Date.now() < downUntil.until && !state) {
		return Promise.reject(downUntil.error)
	}
	if (!state || state.chainId !== network.chainId) {
		state = startConnecting(network, 0)
	}
	return state.client
}

/** Drop the endpoint behind `failed` and move on to the next one. */
function rotateEndpoint(failed: Promise<CosmWasmClient>) {
	if (!state || state.client !== failed) return
	failed.then(c => c.disconnect()).catch(() => undefined)
	state = startConnecting(getNetwork(), state.index + 1)
}

/**
 * True for errors that come from the contract or chain state (bad query,
 * unknown contract, ...): another RPC node would answer the same.
 */
export function isDeterministicQueryError(e: unknown): boolean {
	return /Query failed with \(\d+\)|query wasm contract failed|unknown variant|not found|Error parsing into type|invalid address|decoding bech32|no such contract/i.test(
		errorMessage(e)
	)
}

/**
 * Runs `fn` with the query client. Network failures move to the next RPC
 * endpoint and retry (once per endpoint); contract errors are thrown as is.
 */
export async function withQueryClient<T>(fn: (client: CosmWasmClient) => Promise<T>, what = 'Chain query'): Promise<T> {
	const attempts = Math.max(1, getNetwork().rpc.length)
	let lastError: unknown
	for (let attempt = 0; attempt < attempts; attempt++) {
		const clientPromise = getQueryClient()
		try {
			const client = await clientPromise
			return await withTimeout(fn(client), QUERY_TIMEOUT_MS, what)
		} catch (e) {
			// Contract errors are the same on every node; "all nodes down" was already retried.
			if (isDeterministicQueryError(e) || e instanceof RpcUnavailableError) throw e
			lastError = e
			rotateEndpoint(clientPromise)
		}
	}
	throw lastError
}

export function queryContract<T>(contractAddress: string, query: Record<string, unknown>): Promise<T> {
	const name = Object.keys(query)[0] ?? 'query'
	return withQueryClient(client => client.queryContractSmart(contractAddress, query) as Promise<T>, `Query ${name}`)
}

/** Bank balance in micro units, as a string. */
export function getBankBalance(address: string, denom: string): Promise<string> {
	return withQueryClient(async client => (await client.getBalance(address, denom)).amount, 'Balance query')
}

export function getTx(hash: string) {
	return withQueryClient(client => client.getTx(hash), 'Tx lookup')
}

/** For tests. */
export function resetQueryClient() {
	state = null
	downUntil = null
}
