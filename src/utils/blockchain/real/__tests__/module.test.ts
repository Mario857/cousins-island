import { beforeEach, describe, expect, it, vi } from 'vitest'

// The chain and the wallet are mocked: these tests check how the module uses
// contract responses, not the network.

const state = vi.hoisted(() => ({
	marketplace: '' as string,
	responses: {} as Record<string, (msg: Record<string, unknown>, contract: string) => unknown>,
	executed: [] as { contractAddress: string; msg: Record<string, unknown>; funds?: unknown }[],
}))

vi.mock('config/contracts', () => ({
	getMarketplaceAddress: () => state.marketplace,
	isMarketplaceDeployed: () => Boolean(state.marketplace),
}))

vi.mock('../chain', async importOriginal => {
	const original = await importOriginal<typeof import('../chain')>()
	return {
		...original,
		queryContract: vi.fn(async (contract: string, msg: Record<string, unknown>) => {
			const name = Object.keys(msg)[0]
			const handler = state.responses[name]
			if (!handler) throw new Error(`Query failed with (6): unexpected query ${name}`)
			return handler(msg[name] as Record<string, unknown>, contract)
		}),
		getBankBalance: vi.fn(async () => '2500000'),
	}
})

vi.mock('../tx', async importOriginal => {
	const original = await importOriginal<typeof import('../tx')>()
	const receipt = { txId: 'HASH', txTerraFinderUrl: 'https://x/tx/HASH', txFee: '0.01 LUNA' }
	return {
		...original,
		executeContract: vi.fn(async (m: (typeof state.executed)[number]) => {
			state.executed.push(m)
			return receipt
		}),
		executeContracts: vi.fn(async (ms: typeof state.executed) => {
			state.executed.push(...ms)
			return receipt
		}),
	}
})

import blockchain from '../index'
import { clearCollectionCaches } from '../collection-data'
import { setWallet } from '../wallet-session'

const MARKET = 'terra1market'
const NFT = 'terra1nft'
const ME = 'terra1me'
const OTHER = 'terra1other'

function connect(address = ME) {
	setWallet({ address, network: {} as never, getSigningClient: async () => ({}) as never })
}

beforeEach(() => {
	state.marketplace = ''
	state.responses = {}
	state.executed = []
	clearCollectionCaches()
	setWallet(null)
	try {
		localStorage.clear()
	} catch {
		// ignore
	}
})

describe('when the marketplace is not deployed', () => {
	it('returns empty data instead of failing', async () => {
		expect(await blockchain.getNFTCollections()).toEqual([])
		expect(await blockchain.getCollectionsVolumes()).toEqual({})
		expect(await blockchain.getFloorPriceInCollection(NFT)).toBe(0)
		expect(await blockchain.getTotalVolumeInCollection(NFT)).toBe(0)
		expect(await blockchain.getAvgDailyVolumeInCollection(NFT)).toBe(0)
		expect(await blockchain.getLatestTransactions({ type: [], limit: 20, offset: 0 })).toEqual({
			latestTransactions: [],
			currentOffset: 0,
		})
		expect(await blockchain.getAllBidsForToken(NFT, '1')).toEqual([])
		expect(await blockchain.getTokensOnSellForUser()).toEqual([])
		await expect(blockchain.getNFTCollection(NFT)).rejects.toThrow(/not deployed/)
	})

	it('has no marketplace balance', async () => {
		expect(await blockchain.getWithdrawableBalance()).toEqual({ LUNA: 0, UST: 0 })
		await expect(blockchain.withdraw(1, 'LUNA')).rejects.toThrow('Not needed: bids are paid when placed')
		await expect(blockchain.depositTokensOnMarketplace(1, 'LUNA')).rejects.toThrow('Not needed: bids are paid when placed')
		expect(await blockchain.getBalanceUST()).toBe(0)
		expect(await blockchain.getBalanceLUART()).toBe(0)
	})
})

describe('with the marketplace deployed', () => {
	const registered = {
		address: NFT,
		collection: { name: 'Cousins', royalty_bps: 450, royalty_recipient: 'terra1artist', enabled: true, registered_at: 1_700_000_000 },
		stats: { volume: '3000000', volume_24h: '1000000', sales: 1, listed: 1, floor_price: '2000000' },
	}

	beforeEach(() => {
		state.marketplace = MARKET
		state.responses = {
			collections: () => ({ collections: [registered] }),
			config: () => ({ admin: 'a', fee_bps: 250, fee_recipient: 'f', denom: 'uluna', paused: false }),
			stats: () => registered.stats,
			num_tokens: () => ({ count: 3 }),
			all_tokens: () => ({ tokens: ['1', '2', '3'] }),
			nft_info: (msg: Record<string, unknown>) => ({
				token_uri: null,
				extension: {
					name: `Cousin ${msg.token_id}`,
					image: `ipfs://Qm/${msg.token_id}.png`,
					attributes: [{ trait_type: 'Hat', value: msg.token_id === '1' ? 'Gold' : 'Red' }],
				},
			}),
			listing: (msg: Record<string, unknown>) => ({
				listing:
					msg.token_id === '2'
						? { collection: NFT, token_id: '2', seller: OTHER, price: '2000000', listed_at: 1_700_000_100, seq: 1 }
						: msg.token_id === '3'
							? { collection: NFT, token_id: '3', seller: ME, price: '4000000', listed_at: 1_700_000_200, seq: 2 }
							: null,
			}),
			listings: () => ({
				listings: [
					{ collection: NFT, token_id: '3', seller: ME, price: '4000000', listed_at: 1_700_000_200, seq: 2 },
					{ collection: NFT, token_id: '2', seller: OTHER, price: '2000000', listed_at: 1_700_000_100, seq: 1 },
				],
			}),
			owner_of: (msg: Record<string, unknown>) => ({ owner: msg.token_id === '1' ? ME : MARKET }),
			bid: (msg: Record<string, unknown>) => ({
				bid: { id: msg.bid_id, collection: NFT, token_id: msg.bid_id === 1 ? '1' : '3', bidder: OTHER, amount: '1500000', created_at: 1 },
			}),
			bids_for_token: () => ({
				bids: [{ id: 9, collection: NFT, token_id: '1', bidder: OTHER, amount: '1500000', created_at: 1_700_000_300 }],
			}),
		}
	})

	it('maps collections, stats and volumes', async () => {
		const [c] = await blockchain.getNFTCollections()
		expect(c).toMatchObject({ title: 'Cousins', totalTokensCount: 3, nftContractAddress: NFT, marketplaceListingStart: 1_700_000_000_000 })
		expect(await blockchain.getCollectionsVolumes()).toEqual({ [NFT]: { uluna: 3, last24h: 1 } })
		expect(await blockchain.getFloorPriceInCollection(NFT)).toBe(2)
		expect(await blockchain.getLast24hVolumeInCollection(NFT)).toBe(1)

		const details = await blockchain.getNFTCollection(NFT)
		expect(details.possibleTraits.Hat).toEqual([
			{ value: 'Red', rarity: 66.67 },
			{ value: 'Gold', rarity: 33.33 },
		])
	})

	it('lists tokens with prices, sorted and paged', async () => {
		const page = await blockchain.getTokensInCollection({ nftContractAddress: NFT, page: 1, traitFilters: {}, sort: 'PRICE_LOWEST' })
		expect(page.tokens.map(t => [t.tokenId, t.sellPriceAmount])).toEqual([
			['2', 2],
			['3', 4],
			['1', undefined],
		])
		expect(page.tokens[0]).toMatchObject({ collectionTitle: 'Cousins', imageURL: 'https://ipfs.io/ipfs/Qm/2.png', sellPriceCurrency: 'LUNA' })
		expect(page.tokens[2].traits.Hat).toEqual({ value: 'Gold', rarity: 33.33 })
		expect(page).toMatchObject({ pagesCount: 1, totalResults: 3 })
	})

	it('computes trading details for an unlisted token I own', async () => {
		connect()
		const d = await blockchain.getTokenTradingDetailsForUser(NFT, '1')
		expect(d).toMatchObject({
			owner: ME,
			sellPriceAmount: undefined,
			canUserSell: true,
			canUserBuy: false,
			canUserBid: false,
			doesUserOwnIt: true,
			sellFees: { luartFee: '2.5%', royaltyFee: '4.5%', txFee: '~0.02 LUNA' },
		})
	})

	it('computes trading details for someone else\'s listing', async () => {
		connect()
		const d = await blockchain.getTokenTradingDetailsForUser(NFT, '2')
		expect(d).toMatchObject({ owner: OTHER, sellPriceAmount: 2, sellPriceCurrency: 'LUNA', canUserSell: false, canUserBuy: true, canUserBid: true, doesUserOwnIt: false })
	})

	it('computes trading details for my listing (escrowed)', async () => {
		connect()
		const d = await blockchain.getTokenTradingDetailsForUser(NFT, '3')
		expect(d).toMatchObject({ owner: ME, canUserSell: false, canUserBuy: false, canUserBid: false, doesUserOwnIt: true })
	})

	it('lists via send_nft and buys with the exact price', async () => {
		connect()
		await blockchain.offerSellPrice(NFT, '1', 1.5, 'LUNA')
		const list = state.executed[0]
		expect(list.contractAddress).toBe(NFT)
		const sendNft = list.msg.send_nft as { contract: string; token_id: string; msg: string }
		expect(sendNft.contract).toBe(MARKET)
		expect(JSON.parse(atob(sendNft.msg))).toEqual({ list: { price: '1500000' } })

		await blockchain.buyNow(NFT, '2', 2, 'LUNA')
		expect(state.executed[1]).toEqual({
			contractAddress: MARKET,
			msg: { buy: { collection: NFT, token_id: '2' } },
			funds: [{ denom: 'uluna', amount: '2000000' }],
		})
		await expect(blockchain.buyNow(NFT, '2', 1, 'LUNA')).rejects.toThrow(/price changed/)
		await expect(blockchain.offerSellPrice(NFT, '1', 1, 'UST')).rejects.toThrow(/Only LUNA/)
	})

	it('updates the price when I already listed the token', async () => {
		connect()
		await blockchain.offerSellPrice(NFT, '3', 5, 'LUNA')
		expect(state.executed[0]).toEqual({
			contractAddress: MARKET,
			msg: { update_price: { collection: NFT, token_id: '3', price: '5000000' } },
		})
	})

	it('places, cancels and accepts bids', async () => {
		connect()
		await blockchain.postBid({ nftContractAddress: NFT, tokenId: '2', amount: 1.25, currency: 'LUNA' })
		expect(state.executed[0]).toEqual({
			contractAddress: MARKET,
			msg: { place_bid: { collection: NFT, token_id: '2' } },
			funds: [{ denom: 'uluna', amount: '1250000' }],
		})

		await blockchain.cancelBid('7')
		expect(state.executed[1].msg).toEqual({ cancel_bid: { bid_id: 7 } })

		// Bid 1 is on token 1: not listed, in my wallet -> send_nft with accept_bid
		await blockchain.executeBid('1')
		const send = state.executed[2]
		expect(send.contractAddress).toBe(NFT)
		expect(JSON.parse(atob((send.msg.send_nft as { msg: string }).msg))).toEqual({ accept_bid: { bid_id: 1 } })

		// Bid 2 is on token 3: listed by me -> accept_bid
		await blockchain.executeBid('2')
		expect(state.executed[3]).toEqual({ contractAddress: MARKET, msg: { accept_bid: { bid_id: 2 } } })

		await expect(blockchain.cancelBid('nope')).rejects.toThrow(/Invalid bid id/)
	})

	it('maps bids to the UI shape', async () => {
		const [bid] = await blockchain.getAllBidsForToken(NFT, '1')
		expect(bid).toMatchObject({
			creatorAddress: OTHER,
			isActive: true,
			bidOrderId: '9',
			timestamp: 1_700_000_300_000,
			nftContractAddress: NFT,
			tokenId: '1',
			amount: 1.5,
			currency: 'LUNA',
			tokenDetails: { name: 'Cousin 1', collectionTitle: 'Cousins' },
		})
	})

	it('pages activity with the contract cursor', async () => {
		const calls: Record<string, unknown>[] = []
		state.responses.activity = (msg: Record<string, unknown>) => {
			calls.push(msg)
			const start = (msg.start_before as number | undefined) ?? 6
			const ids = [start - 1, start - 2].filter(id => id > 0)
			return {
				activity: ids.map(id => ({
					id,
					kind: 'sale',
					collection: NFT,
					token_id: '1',
					actor: ME,
					counterparty: OTHER,
					price: '1000000',
					timestamp: 1_700_000_000 + id,
					height: 1000 + id,
				})),
				next: ids.length === 2 && ids[1] > 1 ? ids[1] : null,
			}
		}
		const query = { type: ['marketplace_execute_order' as const], limit: 2, offset: 0 }
		const first = await blockchain.getLatestTransactions(query)
		expect(first.latestTransactions.map(t => t.id)).toEqual([5, 4])
		expect(first.currentOffset).toBe(2)
		expect(first.latestTransactions[0]).toMatchObject({
			type: 'marketplace_execute_order',
			kind: 'sale',
			buyer: ME,
			seller: OTHER,
			price: 1,
			currency: 'LUNA',
			timestamp: 1_700_000_005_000,
		})
		expect(calls[0]).toMatchObject({ kinds: ['sale', 'accept_bid'], start_before: undefined })

		const second = await blockchain.getLatestTransactions({ ...query, offset: first.currentOffset })
		expect(second.latestTransactions.map(t => t.id)).toEqual([3, 2])
		expect(calls[1]).toMatchObject({ start_before: 4 })

		const third = await blockchain.getLatestTransactions({ ...query, offset: second.currentOffset })
		expect(third.latestTransactions.map(t => t.id)).toEqual([1])
		const done = await blockchain.getLatestTransactions({ ...query, offset: third.currentOffset })
		expect(done.latestTransactions).toEqual([])
	})

	it('reads the LUNA balance of the connected wallet', async () => {
		connect()
		expect(await blockchain.getBalanceLUNA()).toBe(2.5)
	})
})
