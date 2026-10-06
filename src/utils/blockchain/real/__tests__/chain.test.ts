import { beforeEach, describe, expect, it, vi } from 'vitest'

// RPC failover: the first endpoint is down, the second works.

const rpc = vi.hoisted(() => ({
	down: new Set<string>(),
	queries: [] as string[],
	failQueriesOn: new Set<string>(),
}))

vi.mock('config/networks', () => ({
	getNetwork: () => ({ chainId: 'pisco-1', name: 'Terra Testnet', rpc: ['https://a', 'https://b'] }),
}))

vi.mock('@cosmjs/tendermint-rpc', () => {
	class FakeRpc {
		constructor(public url: string) {}
	}
	const client = (rpcClient: FakeRpc) => ({
		url: rpcClient.url,
		status: async () => {
			if (rpc.down.has(rpcClient.url)) throw new Error('connect ECONNREFUSED')
			return { nodeInfo: { version: '0.38.17' } }
		},
		disconnect: () => undefined,
	})
	return {
		HttpBatchClient: FakeRpc,
		HttpClient: FakeRpc,
		Tendermint37Client: { create: client },
		Comet38Client: { create: client },
		Comet1Client: { create: client },
	}
})

vi.mock('@cosmjs/cosmwasm-stargate', () => ({
	CosmWasmClient: {
		create: (comet: { url: string }) => ({
			disconnect: () => undefined,
			queryContractSmart: async (address: string, msg: Record<string, unknown>) => {
				rpc.queries.push(comet.url)
				if (rpc.failQueriesOn.has(comet.url)) throw new Error('fetch failed')
				if (address === 'bad') throw new Error('Query failed with (6): unknown variant `nope`')
				return { from: comet.url, msg }
			},
		}),
	},
}))

import { queryContract, resetQueryClient } from '../chain'

beforeEach(() => {
	rpc.down.clear()
	rpc.failQueriesOn.clear()
	rpc.queries = []
	resetQueryClient()
})

describe('RPC fallback', () => {
	it('uses the first endpoint that connects', async () => {
		rpc.down.add('https://a')
		expect(await queryContract('c', { config: {} })).toMatchObject({ from: 'https://b' })
		// cached: no reconnect
		expect(await queryContract('c', { config: {} })).toMatchObject({ from: 'https://b' })
		expect(rpc.queries).toEqual(['https://b', 'https://b'])
	})

	it('moves to the next endpoint when queries fail', async () => {
		rpc.failQueriesOn.add('https://a')
		expect(await queryContract('c', { config: {} })).toMatchObject({ from: 'https://b' })
		expect(rpc.queries).toEqual(['https://a', 'https://b'])
	})

	it('does not retry contract errors on other nodes', async () => {
		await expect(queryContract('bad', { nope: {} })).rejects.toThrow(/unknown variant/)
		expect(rpc.queries).toEqual(['https://a'])
	})

	it('fails clearly when every endpoint is down', async () => {
		rpc.down.add('https://a')
		rpc.down.add('https://b')
		await expect(queryContract('c', { config: {} })).rejects.toThrow(/Could not reach any Terra Testnet RPC node/)
		// cooldown: fails fast without reconnecting
		await expect(queryContract('c', { config: {} })).rejects.toThrow(/Could not reach any/)
	})
})
