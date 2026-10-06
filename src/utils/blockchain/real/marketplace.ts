import { getMarketplaceAddress, isMarketplaceDeployed } from 'config/contracts'
import type { TxReceipt } from '../blockchain.interface'
import { assertLuna, lunaCoins, toUluna } from './amounts'
import { queryContract } from './chain'
import type {
	Activity,
	ActivityKindJson,
	CollectionResponse,
	ContractBid,
	Listing,
	ListingCursor,
	ListingSortJson,
	MarketplaceConfig,
	Stats,
} from './types'
import { encodeHookMsg, executeContract, executeContracts } from './tx'

// Thin typed wrapper around the Cousins marketplace contract.

const MAX_LIMIT = 100
const MAX_COLLECTIONS_LIMIT = 50
const CONFIG_TTL_MS = 5 * 60_000

export class MarketplaceNotDeployedError extends Error {
	constructor() {
		super('The marketplace contract is not deployed on this network yet')
		this.name = 'MarketplaceNotDeployedError'
	}
}

export function isDeployed(): boolean {
	return isMarketplaceDeployed()
}

function address(): string {
	const addr = getMarketplaceAddress()
	if (!addr) throw new MarketplaceNotDeployedError()
	return addr
}

function query<T>(msg: Record<string, unknown>): Promise<T> {
	return queryContract<T>(address(), msg)
}

// Queries -------------------------------------------------------------------

let configCache: { at: number; addr: string; value: Promise<MarketplaceConfig> } | null = null

export function getConfig(): Promise<MarketplaceConfig> {
	const addr = address()
	if (!configCache || configCache.addr !== addr || Date.now() - configCache.at > CONFIG_TTL_MS) {
		const value = query<MarketplaceConfig>({ config: {} })
		configCache = { at: Date.now(), addr, value }
		value.catch(() => {
			if (configCache?.value === value) configCache = null
		})
	}
	return configCache.value
}

export async function getCollections(): Promise<CollectionResponse[]> {
	if (!isDeployed()) return []
	const all: CollectionResponse[] = []
	let startAfter: string | undefined
	for (;;) {
		const res = await query<{ collections: CollectionResponse[] }>({
			collections: { start_after: startAfter, limit: MAX_COLLECTIONS_LIMIT },
		})
		all.push(...res.collections)
		if (res.collections.length < MAX_COLLECTIONS_LIMIT) return all
		startAfter = res.collections[res.collections.length - 1].address
	}
}

export function getCollection(collection: string): Promise<CollectionResponse> {
	return query<CollectionResponse>({ collection: { address: collection } })
}

export function getStats(collection: string): Promise<Stats> {
	return query<Stats>({ stats: { collection } })
}

export async function getListing(collection: string, tokenId: string): Promise<Listing | null> {
	const res = await query<{ listing: Listing | null }>({ listing: { collection, token_id: tokenId } })
	return res.listing ?? null
}

/** Every active listing of a collection (follows the cursor), up to `max`. */
export async function getAllListings(collection: string, sort: ListingSortJson = 'newest', max = 10_000): Promise<Listing[]> {
	const all: Listing[] = []
	let cursor: ListingCursor | undefined
	while (all.length < max) {
		const res = await query<{ listings: Listing[] }>({
			listings: { collection, sort, start_after: cursor, limit: MAX_LIMIT },
		})
		all.push(...res.listings)
		if (res.listings.length < MAX_LIMIT) break
		const last = res.listings[res.listings.length - 1]
		cursor = { token_id: last.token_id, price: last.price, seq: last.seq }
	}
	return all
}

export async function getListingsBySeller(seller: string, max = 1000): Promise<Listing[]> {
	const all: Listing[] = []
	let startAfter: { collection: string; token_id: string } | undefined
	while (all.length < max) {
		const res = await query<{ listings: Listing[] }>({
			listings_by_seller: { seller, start_after: startAfter, limit: MAX_LIMIT },
		})
		all.push(...res.listings)
		if (res.listings.length < MAX_LIMIT) break
		const last = res.listings[res.listings.length - 1]
		startAfter = { collection: last.collection, token_id: last.token_id }
	}
	return all
}

export async function getBid(bidId: number): Promise<ContractBid | null> {
	const res = await query<{ bid: ContractBid | null }>({ bid: { bid_id: bidId } })
	return res.bid ?? null
}

/** Bids on one token, highest first. */
export async function getBidsForToken(collection: string, tokenId: string): Promise<ContractBid[]> {
	const res = await query<{ bids: ContractBid[] }>({
		bids_for_token: { collection, token_id: tokenId, limit: MAX_LIMIT },
	})
	return res.bids
}

/** Bids placed by `bidder`, newest first. */
export async function getBidsByBidder(bidder: string, max = 500): Promise<ContractBid[]> {
	const all: ContractBid[] = []
	let startBefore: number | undefined
	while (all.length < max) {
		const res = await query<{ bids: ContractBid[] }>({
			bids_by_bidder: { bidder, start_before: startBefore, limit: MAX_LIMIT },
		})
		all.push(...res.bids)
		if (res.bids.length < MAX_LIMIT) break
		startBefore = res.bids[res.bids.length - 1].id
	}
	return all
}

export interface ActivityFilter {
	collection?: string
	tokenId?: string
	user?: string
	kinds?: ActivityKindJson[]
}

export function getActivityPage(
	filter: ActivityFilter,
	startBefore: number | undefined,
	limit: number
): Promise<{ activity: Activity[]; next: number | null }> {
	return query<{ activity: Activity[]; next?: number | null }>({
		activity: {
			collection: filter.collection,
			token_id: filter.tokenId,
			user: filter.user,
			kinds: filter.kinds,
			start_before: startBefore,
			limit: Math.min(MAX_LIMIT, Math.max(1, limit)),
		},
	}).then(res => ({ activity: res.activity, next: res.next ?? null }))
}

/**
 * Up to `limit` matching entries starting before `startBefore`. A filtered
 * query can return fewer entries than asked (the contract scans at most 500
 * per call), so keep following `next` until the page is full or history ends.
 */
export async function getActivity(
	filter: ActivityFilter,
	startBefore: number | undefined,
	limit: number,
	maxCalls = 10
): Promise<{ activity: Activity[]; next: number | null }> {
	const activity: Activity[] = []
	let cursor = startBefore
	for (let call = 0; call < maxCalls; call++) {
		const page = await getActivityPage(filter, cursor, limit - activity.length)
		activity.push(...page.activity)
		if (page.next === null) return { activity, next: null }
		cursor = page.next
		if (activity.length >= limit) break
	}
	return { activity, next: cursor ?? null }
}

// Transactions --------------------------------------------------------------

/** Lists an NFT: it's sent to the marketplace (escrow) with the price. */
export async function list(nftContractAddress: string, tokenId: string, amount: number, currency = 'LUNA'): Promise<TxReceipt> {
	assertLuna(currency)
	const price = toUluna(amount)
	if (price === '0') throw new Error('Price must be greater than zero')
	return executeContract({
		contractAddress: nftContractAddress,
		msg: {
			send_nft: {
				contract: address(),
				token_id: tokenId,
				msg: encodeHookMsg({ list: { price } }),
			},
		},
	})
}

export async function updatePrice(nftContractAddress: string, tokenId: string, amount: number, currency = 'LUNA'): Promise<TxReceipt> {
	assertLuna(currency)
	const price = toUluna(amount)
	if (price === '0') throw new Error('Price must be greater than zero')
	return executeContract({
		contractAddress: address(),
		msg: { update_price: { collection: nftContractAddress, token_id: tokenId, price } },
	})
}

export function cancelListing(nftContractAddress: string, tokenId: string): Promise<TxReceipt> {
	return executeContract({
		contractAddress: address(),
		msg: { cancel_listing: { collection: nftContractAddress, token_id: tokenId } },
	})
}

/** Buys at the listing price: `priceUluna` must be exactly the listing price. */
export function buy(nftContractAddress: string, tokenId: string, priceUluna: string): Promise<TxReceipt> {
	return executeContract({
		contractAddress: address(),
		msg: { buy: { collection: nftContractAddress, token_id: tokenId } },
		funds: [{ denom: 'uluna', amount: priceUluna }],
	})
}

export async function placeBid(nftContractAddress: string, tokenId: string, amount: number, currency = 'LUNA'): Promise<TxReceipt> {
	assertLuna(currency)
	const funds = lunaCoins(amount)
	if (funds[0].amount === '0') throw new Error('Bid must be greater than zero')
	return executeContract({
		contractAddress: address(),
		msg: { place_bid: { collection: nftContractAddress, token_id: tokenId } },
		funds,
	})
}

export function cancelBid(bidId: number): Promise<TxReceipt> {
	return executeContract({ contractAddress: address(), msg: { cancel_bid: { bid_id: bidId } } })
}

/** Accept a bid on an NFT you have listed here. */
export function acceptBidOnListing(bidId: number): Promise<TxReceipt> {
	return executeContract({ contractAddress: address(), msg: { accept_bid: { bid_id: bidId } } })
}

/** Accept a bid on an NFT in your wallet (not listed): send it to the marketplace. */
export function acceptBidWithNft(nftContractAddress: string, tokenId: string, bidId: number): Promise<TxReceipt> {
	return executeContract({
		contractAddress: nftContractAddress,
		msg: {
			send_nft: {
				contract: address(),
				token_id: tokenId,
				msg: encodeHookMsg({ accept_bid: { bid_id: bidId } }),
			},
		},
	})
}

export { executeContracts }
