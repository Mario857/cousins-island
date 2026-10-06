import { fromUtf8 } from '@cosmjs/encoding'
import { describe, expect, it } from 'vitest'
import { encodeHookMsg, feeFromEvents, friendlyTxError, receiptFromResult, toExecuteEncodeObject } from '../tx'

describe('encodeHookMsg', () => {
	it('base64-encodes the JSON hook message', () => {
		const encoded = encodeHookMsg({ list: { price: '1000000' } })
		expect(atob(encoded)).toBe('{"list":{"price":"1000000"}}')
		expect(atob(encodeHookMsg({ accept_bid: { bid_id: 7 } }))).toBe('{"accept_bid":{"bid_id":7}}')
	})
})

describe('toExecuteEncodeObject', () => {
	it('builds a MsgExecuteContract', () => {
		const obj = toExecuteEncodeObject('terra1me', {
			contractAddress: 'terra1market',
			msg: { buy: { collection: 'c', token_id: '1' } },
			funds: [{ denom: 'uluna', amount: '5' }],
		})
		expect(obj.typeUrl).toBe('/cosmwasm.wasm.v1.MsgExecuteContract')
		expect(obj.value.sender).toBe('terra1me')
		expect(obj.value.contract).toBe('terra1market')
		expect(JSON.parse(fromUtf8(obj.value.msg!))).toEqual({ buy: { collection: 'c', token_id: '1' } })
		expect(obj.value.funds).toEqual([{ denom: 'uluna', amount: '5' }])
	})
})

describe('fees', () => {
	const events = [
		{ type: 'coin_spent', attributes: [{ key: 'amount', value: '4523uluna' }] },
		{ type: 'tx', attributes: [{ key: 'fee', value: '4523uluna' }, { key: 'fee_payer', value: 'terra1me' }] },
	]

	it('reads the paid fee from tx events', () => {
		expect(feeFromEvents(events)).toEqual([{ amount: '4523', denom: 'uluna' }])
		expect(feeFromEvents([{ type: 'tx', attributes: [{ key: 'fee', value: '' }] }])).toEqual([])
		expect(feeFromEvents([])).toBeUndefined()
	})

	it('builds the receipt with the real fee', () => {
		const receipt = receiptFromResult({ transactionHash: 'ABC', events })
		expect(receipt.txId).toBe('ABC')
		expect(receipt.txFee).toBe('0.004523 LUNA')
		expect(receipt.txTerraFinderUrl).toContain('ABC')
	})

	it('falls back to an estimate when the fee is unknown', () => {
		expect(receiptFromResult({ transactionHash: 'ABC', events: [] }).txFee).toBe('~0.02 LUNA')
	})
})

describe('friendlyTxError', () => {
	it('recognises rejections and missing funds', () => {
		expect(friendlyTxError(new Error('Request rejected')).message).toBe('Transaction rejected in the wallet')
		expect(
			friendlyTxError(new Error('Broadcasting transaction failed with code 5: insufficient funds: 1uluna is smaller than 2uluna')).message
		).toMatch(/Not enough LUNA/)
	})

	it('extracts the contract error', () => {
		const raw =
			'Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: You already have a bid on this NFT (bid 3); cancel it first: execute wasm contract failed [CosmWasm/wasmd@v0.53.0/x/wasm/keeper/keeper.go:415] with gas used: \'123\': unknown request'
		expect(friendlyTxError(new Error(raw)).message).toBe('You already have a bid on this NFT (bid 3); cancel it first')
	})

	it('keeps unknown errors', () => {
		expect(friendlyTxError(new Error('boom')).message).toBe('boom')
		expect(friendlyTxError('text').message).toBe('text')
	})
})
