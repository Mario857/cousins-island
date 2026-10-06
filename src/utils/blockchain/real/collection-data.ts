import lscache from 'lscache'
import { getNetworkId } from 'config/networks'
import type { NFTCollectionDetails, NFTTokenDetails, TraitValue } from '../blockchain.interface'
import { errorMessage } from './chain'
import * as cw721 from './cw721'
import * as marketplace from './marketplace'
import { applyRarity, collectionResponseToDetails, computePossibleTraits, metadataToTokenDetails } from './mapping'
import type { CollectionResponse, Listing } from './types'

// Loads and caches collection data: the registered collections, every token's
// metadata (for traits, rarity and the collection grid) and active listings.

/** Max tokens loaded per collection for the grid / rarity. */
export const MAX_TOKENS_PER_COLLECTION = 3000
const METADATA_CONCURRENCY = 8
const REGISTRY_TTL_MS = 60_000
const COLLECTION_TOKENS_TTL_MS = 10 * 60_000
/** Listings are cached briefly (also across page reloads) like the old app did. */
const LISTINGS_CACHE_MINUTES = 0.2

export async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
	const results = new Array<R>(items.length)
	let next = 0
	const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (next < items.length) {
			const index = next++
			results[index] = await fn(items[index], index)
		}
	})
	await Promise.all(workers)
	return results
}

// Registered collections ----------------------------------------------------

let registryCache: { at: number; chainId: string; value: Promise<CollectionResponse[]> } | null = null

export function getRegisteredCollections(): Promise<CollectionResponse[]> {
	const chainId = getNetworkId()
	if (!registryCache || registryCache.chainId !== chainId || Date.now() - registryCache.at > REGISTRY_TTL_MS) {
		const value = marketplace.getCollections()
		const entry = { at: Date.now(), chainId, value }
		value.catch(() => {
			if (registryCache === entry) registryCache = null
		})
		registryCache = entry
	}
	return registryCache.value
}

export async function findRegisteredCollection(nftContractAddress: string): Promise<CollectionResponse | undefined> {
	if (!marketplace.isDeployed()) return undefined
	const all = await getRegisteredCollections()
	return all.find(c => c.address === nftContractAddress)
}

const titleCache = new Map<string, Promise<string>>()

/** Collection name: as registered on the marketplace, else the cw721 name. */
export function getCollectionTitle(nftContractAddress: string): Promise<string> {
	let cached = titleCache.get(nftContractAddress)
	if (!cached) {
		cached = (async () => {
			try {
				const registered = await findRegisteredCollection(nftContractAddress)
				if (registered) return registered.collection.name
			} catch {
				// fall through to cw721
			}
			const info = await cw721.getCollectionInfo(nftContractAddress)
			return info?.name ?? ''
		})()
		cached.catch(() => titleCache.delete(nftContractAddress))
		titleCache.set(nftContractAddress, cached)
	}
	return cached
}

const countCache = new Map<string, { at: number; value: Promise<number> }>()

export function getTokenCount(nftContractAddress: string): Promise<number> {
	const hit = countCache.get(nftContractAddress)
	if (hit && Date.now() - hit.at < REGISTRY_TTL_MS) return hit.value
	const value = cw721.getNumTokens(nftContractAddress)
	const entry = { at: Date.now(), value }
	value.catch(() => {
		if (countCache.get(nftContractAddress) === entry) countCache.delete(nftContractAddress)
	})
	countCache.set(nftContractAddress, entry)
	return value
}

// Token metadata ------------------------------------------------------------

/** Per collection: tokens loaded so far (rarity 0), keyed by token id. */
const tokenCache = new Map<string, Map<string, NFTTokenDetails>>()

function tokensOf(nftContractAddress: string): Map<string, NFTTokenDetails> {
	let map = tokenCache.get(nftContractAddress)
	if (!map) {
		map = new Map()
		tokenCache.set(nftContractAddress, map)
	}
	return map
}

/** `ok` is false when the metadata couldn't be loaded (a placeholder is returned and must not be cached). */
async function fetchTokenDetails(
	nftContractAddress: string,
	tokenId: string,
	collectionTitle: string
): Promise<{ details: NFTTokenDetails; ok: boolean }> {
	try {
		const info = await cw721.getNftInfo(nftContractAddress, tokenId)
		const metadata = await cw721.resolveMetadata(info)
		return {
			details: metadataToTokenDetails({ nftContractAddress, tokenId, metadata, collectionTitle, tokenUri: info.token_uri }),
			ok: true,
		}
	} catch (e) {
		console.warn(`Could not load metadata of ${nftContractAddress} #${tokenId}: ${errorMessage(e)}`)
		return { details: metadataToTokenDetails({ nftContractAddress, tokenId, metadata: null, collectionTitle }), ok: false }
	}
}

/** Loads (and caches) details for token ids not in the cache yet. Returns how many failed. */
async function loadMissing(nftContractAddress: string, ids: readonly string[], title: string): Promise<Map<string, NFTTokenDetails>> {
	const cache = tokensOf(nftContractAddress)
	const failed = new Map<string, NFTTokenDetails>()
	await mapWithConcurrency(
		ids.filter(id => !cache.has(id)),
		METADATA_CONCURRENCY,
		async id => {
			const { details, ok } = await fetchTokenDetails(nftContractAddress, id, title)
			if (ok) cache.set(id, details)
			else failed.set(id, details)
		}
	)
	return failed
}

interface CollectionTokens {
	tokens: NFTTokenDetails[]
	possibleTraits: { [traitName: string]: TraitValue[] }
	byId: Map<string, NFTTokenDetails>
}

interface FullCacheEntry {
	at: number
	ttl: number
	value: Promise<CollectionTokens>
	resolved?: CollectionTokens
}

/** A load where some tokens failed is kept only briefly, so they're retried soon. */
const PARTIAL_LOAD_TTL_MS = 30_000

const fullCache = new Map<string, FullCacheEntry>()

/**
 * Every token of a collection with metadata and rarity (capped at
 * MAX_TOKENS_PER_COLLECTION). Cached for a few minutes.
 */
export function getCollectionTokens(nftContractAddress: string): Promise<CollectionTokens> {
	const hit = fullCache.get(nftContractAddress)
	if (hit && Date.now() - hit.at < hit.ttl) return hit.value
	const entry: FullCacheEntry = { at: Date.now(), ttl: COLLECTION_TOKENS_TTL_MS, value: null as never }
	entry.value = (async () => {
		const [title, { ids, truncated }] = await Promise.all([
			getCollectionTitle(nftContractAddress).catch(() => ''),
			cw721.getAllTokenIds(nftContractAddress, MAX_TOKENS_PER_COLLECTION),
		])
		if (truncated) {
			console.warn(
				`${nftContractAddress} has more than ${MAX_TOKENS_PER_COLLECTION} tokens; only the first ${MAX_TOKENS_PER_COLLECTION} are shown and used for rarity`
			)
		}
		const failed = await loadMissing(nftContractAddress, ids, title)
		if (failed.size > 0) {
			console.warn(`${failed.size} of ${ids.length} tokens of ${nftContractAddress} could not be loaded; retrying later`)
			entry.ttl = PARTIAL_LOAD_TTL_MS
		}
		const cache = tokensOf(nftContractAddress)
		const raw = ids.map(id => cache.get(id) ?? failed.get(id)!)
		const possibleTraits = computePossibleTraits(raw)
		const tokens = applyRarity(raw, possibleTraits)
		return { tokens, possibleTraits, byId: new Map(tokens.map(t => [t.tokenId, t])) }
	})()
	const value = entry.value
	value.then(
		v => {
			entry.resolved = v
		},
		() => {
			if (fullCache.get(nftContractAddress) === entry) fullCache.delete(nftContractAddress)
		}
	)
	fullCache.set(nftContractAddress, entry)
	return value
}

/**
 * The finished full load of a collection, if there is one. Doesn't start or
 * wait for a load: a single-token lookup shouldn't wait for thousands.
 */
function getLoadedCollectionTokens(nftContractAddress: string): CollectionTokens | undefined {
	return fullCache.get(nftContractAddress)?.resolved
}

/**
 * Details for specific tokens: from the full collection load when available
 * (with rarity), otherwise fetched one by one (rarity 0).
 */
export async function getTokensDetails(nftContractAddress: string, tokenIds: readonly string[]): Promise<NFTTokenDetails[]> {
	const loaded = getLoadedCollectionTokens(nftContractAddress)
	const cache = tokensOf(nftContractAddress)
	const missing = [...new Set(tokenIds.filter(id => !loaded?.byId.has(id) && !cache.has(id)))]
	let failed = new Map<string, NFTTokenDetails>()
	if (missing.length > 0) {
		const title = await getCollectionTitle(nftContractAddress).catch(() => '')
		failed = await loadMissing(nftContractAddress, missing, title)
	}
	return tokenIds.map(id => ({ ...(loaded?.byId.get(id) ?? cache.get(id) ?? failed.get(id)!) }))
}

export async function getTokenDetails(nftContractAddress: string, tokenId: string): Promise<NFTTokenDetails> {
	const [details] = await getTokensDetails(nftContractAddress, [tokenId])
	return details
}

/** How long the token page waits for the whole collection (for trait rarity) before showing the token without it. */
const RARITY_WAIT_MS = 4000

/**
 * Token details with trait rarity when the collection can be loaded quickly
 * (or already was); otherwise without rarity. The collection keeps loading in
 * the background, so going back to the collection page is fast.
 */
export async function getTokenDetailsWithRarity(nftContractAddress: string, tokenId: string): Promise<NFTTokenDetails> {
	const full = getCollectionTokens(nftContractAddress)
	let timer: ReturnType<typeof setTimeout> | undefined
	const fromFull = await Promise.race([
		full.then(f => f.byId.get(tokenId)).catch(() => undefined),
		new Promise<undefined>(resolve => {
			timer = setTimeout(() => resolve(undefined), RARITY_WAIT_MS)
		}),
	])
	clearTimeout(timer)
	return fromFull ? { ...fromFull } : getTokenDetails(nftContractAddress, tokenId)
}

// Listings ------------------------------------------------------------------

function listingsCacheKey(nftContractAddress: string) {
	return `cousins_listings:${getNetworkId()}:${nftContractAddress}`
}

function lscacheGet<T>(key: string): T | null {
	try {
		lscache.flushExpired()
		return lscache.get(key) as T | null
	} catch {
		return null
	}
}

function lscacheSet(key: string, value: unknown, minutes: number) {
	try {
		lscache.set(key, value, minutes)
	} catch {
		// Storage full or unavailable; the cache is only an optimisation.
	}
}

/** All active listings of a collection ([] when the marketplace isn't deployed). */
export async function getCollectionListings(nftContractAddress: string, options: { fresh?: boolean } = {}): Promise<Listing[]> {
	if (!marketplace.isDeployed()) return []
	const key = listingsCacheKey(nftContractAddress)
	if (!options.fresh) {
		const cached = lscacheGet<Listing[]>(key)
		if (cached) return cached
	}
	const listings = await marketplace.getAllListings(nftContractAddress, 'newest')
	lscacheSet(key, listings, LISTINGS_CACHE_MINUTES)
	return listings
}

/** Call after a trade so the next page load shows fresh listings. */
export function invalidateListings(nftContractAddress: string) {
	try {
		lscache.remove(listingsCacheKey(nftContractAddress))
	} catch {
		// ignore
	}
}

// Collections ---------------------------------------------------------------

export async function getCollectionDetails(
	nftContractAddress: string,
	options: { withTraits?: boolean } = {}
): Promise<NFTCollectionDetails> {
	const { withTraits = true } = options
	const registered = await findRegisteredCollection(nftContractAddress)
	if (!registered) {
		throw new Error(
			marketplace.isDeployed()
				? `Collection ${nftContractAddress} is not listed on this marketplace`
				: 'The marketplace is not deployed on this network yet'
		)
	}
	const [count, traits] = await Promise.all([
		getTokenCount(nftContractAddress).catch(() => 0),
		withTraits
			? getCollectionTokens(nftContractAddress)
					.then(t => t.possibleTraits)
					.catch(e => {
						console.warn(`Could not load traits of ${nftContractAddress}: ${errorMessage(e)}`)
						return {}
					})
			: Promise.resolve({}),
	])
	return collectionResponseToDetails(registered, { totalTokensCount: count, possibleTraits: traits })
}

export async function getAllCollectionDetails(): Promise<NFTCollectionDetails[]> {
	if (!marketplace.isDeployed()) return []
	const registered = await getRegisteredCollections()
	const counts = await Promise.allSettled(registered.map(r => getTokenCount(r.address)))
	return registered.map((r, i) => {
		const count = counts[i]
		return collectionResponseToDetails(r, { totalTokensCount: count.status === 'fulfilled' ? count.value : 0 })
	})
}

/** For tests. */
export function clearCollectionCaches() {
	registryCache = null
	titleCache.clear()
	countCache.clear()
	tokenCache.clear()
	fullCache.clear()
}
