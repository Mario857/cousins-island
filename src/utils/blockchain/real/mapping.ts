// Pure functions that turn contract responses into the shapes the UI uses.
// Kept free of network access so they can be unit tested.

import type {
	ActivityKind,
	LatestTransactionsType,
	NFTCollectionDetails,
	NFTTokenDetails,
	TokenSortType,
	TokensPage,
	TokensQuery,
	TraitValue,
} from '../blockchain.interface'
import { fromUluna } from './amounts'
import { imageDataToUrl, isVideoUrl, looksLikeImageUrl, resolveUri } from './media'
import type { Activity, CollectionResponse, Listing, NftExtension, NftAttribute } from './types'

export const PAGE_SIZE = 21

// ---------------------------------------------------------------------------
// Token metadata
// ---------------------------------------------------------------------------

/** Off-chain JSON metadata (token_uri) uses the same field names as the on-chain extension. */
export type TokenMetadata = NftExtension

function attributeValueToString(value: unknown): string {
	if (value === null || value === undefined) return ''
	if (typeof value === 'string') return value
	if (typeof value === 'number' || typeof value === 'boolean') return String(value)
	try {
		return JSON.stringify(value)
	} catch {
		return String(value)
	}
}

/** Attributes -> { traitName: value } (rarity filled in later). Empty trait names/values are skipped. */
export function attributesToTraitValues(attributes: NftAttribute[] | null | undefined): { [name: string]: string } {
	const traits: { [name: string]: string } = {}
	if (!Array.isArray(attributes)) return traits
	for (const attr of attributes) {
		if (!attr || typeof attr !== 'object') continue
		const name = attributeValueToString(attr.trait_type).trim()
		const value = attributeValueToString(attr.value).trim()
		if (!name || !value) continue
		traits[name] = value
	}
	return traits
}

export function metadataImageUrl(meta: TokenMetadata | null | undefined, gateway?: string): string {
	if (!meta) return ''
	if (meta.image) return resolveUri(meta.image, gateway)
	if (meta.image_data) return imageDataToUrl(meta.image_data)
	// Some collections only set animation_url (videos).
	if (meta.animation_url) return resolveUri(meta.animation_url, gateway)
	return ''
}

/**
 * Builds token details from cw721 metadata (on-chain extension or token_uri JSON).
 * Rarity is 0 here; `applyRarity` fills it in once the whole collection is loaded.
 */
export function metadataToTokenDetails(params: {
	nftContractAddress: string
	tokenId: string
	metadata: TokenMetadata | null | undefined
	collectionTitle?: string
	tokenUri?: string | null
	gateway?: string
}): NFTTokenDetails {
	const { nftContractAddress, tokenId, metadata, collectionTitle, tokenUri, gateway } = params
	let imageURL = metadataImageUrl(metadata, gateway)
	// A token_uri that points straight at an image (no JSON metadata).
	if (!imageURL && tokenUri && looksLikeImageUrl(tokenUri)) imageURL = resolveUri(tokenUri, gateway)

	const animationURL = metadata?.animation_url ? resolveUri(metadata.animation_url, gateway) : undefined
	const traitValues = attributesToTraitValues(metadata?.attributes)
	const traits: { [name: string]: TraitValue } = {}
	for (const [name, value] of Object.entries(traitValues)) traits[name] = { value, rarity: 0 }

	const name = typeof metadata?.name === 'string' && metadata.name.trim() ? metadata.name.trim() : `#${tokenId}`

	return {
		tokenId,
		name,
		description: typeof metadata?.description === 'string' ? metadata.description : undefined,
		imageURL,
		animationURL,
		nftContractAddress,
		collectionTitle,
		traits,
		isVideo: isVideoUrl(imageURL),
	}
}

// ---------------------------------------------------------------------------
// Rarity
// ---------------------------------------------------------------------------

function roundRarity(value: number): number {
	return Number(value.toFixed(2))
}

/**
 * possibleTraits for the collection: every trait value with the share of
 * tokens that have it (percent, 2 decimals), most common first.
 */
export function computePossibleTraits(tokens: Pick<NFTTokenDetails, 'traits'>[]): { [name: string]: TraitValue[] } {
	const total = tokens.length
	const counts: { [name: string]: Map<string, number> } = {}
	for (const token of tokens) {
		for (const [name, trait] of Object.entries(token.traits || {})) {
			const byValue = (counts[name] ??= new Map())
			byValue.set(trait.value, (byValue.get(trait.value) ?? 0) + 1)
		}
	}
	const result: { [name: string]: TraitValue[] } = {}
	for (const [name, byValue] of Object.entries(counts)) {
		result[name] = [...byValue.entries()]
			.map(([value, count]) => ({ value, rarity: total ? roundRarity((count / total) * 100) : 0 }))
			.sort((a, b) => b.rarity - a.rarity || a.value.localeCompare(b.value))
	}
	return result
}

/** Returns copies of the tokens with each trait's rarity taken from possibleTraits. */
export function applyRarity(
	tokens: NFTTokenDetails[],
	possibleTraits: { [name: string]: TraitValue[] }
): NFTTokenDetails[] {
	const lookup: { [name: string]: Map<string, number> } = {}
	for (const [name, values] of Object.entries(possibleTraits)) {
		lookup[name] = new Map(values.map(v => [v.value, v.rarity]))
	}
	return tokens.map(token => {
		const traits: { [name: string]: TraitValue } = {}
		for (const [name, trait] of Object.entries(token.traits || {})) {
			traits[name] = { value: trait.value, rarity: lookup[name]?.get(trait.value) ?? 0 }
		}
		return { ...token, traits }
	})
}

// ---------------------------------------------------------------------------
// Filtering, listings, sorting, paging
// ---------------------------------------------------------------------------

/** A token matches when, for every trait with selected values, its value is one of them. */
export function matchesTraitFilters(
	token: Pick<NFTTokenDetails, 'traits'>,
	traitFilters: TokensQuery['traitFilters'] | undefined
): boolean {
	if (!traitFilters) return true
	for (const [traitName, allowed] of Object.entries(traitFilters)) {
		if (!Array.isArray(allowed) || allowed.length === 0) continue
		const value = token.traits?.[traitName]?.value
		if (value === undefined || !allowed.includes(value)) return false
	}
	return true
}

export interface ListedInfo {
	sellPriceAmount: number
	listingTime: number
	seller: string
	/** Contract listing sequence, for stable "newest/oldest" ordering. */
	seq: number
}

export function listingsToMap(listings: Listing[]): Map<string, ListedInfo> {
	const map = new Map<string, ListedInfo>()
	for (const l of listings) {
		map.set(l.token_id, {
			sellPriceAmount: fromUluna(l.price),
			listingTime: l.listed_at * 1000,
			seller: l.seller,
			seq: l.seq,
		})
	}
	return map
}

/** Copies of the tokens with sale data set from `listed` (and cleared for unlisted ones). */
export function mergeListings(tokens: NFTTokenDetails[], listed: Map<string, ListedInfo>): (NFTTokenDetails & { _seq?: number })[] {
	return tokens.map(token => {
		const { sellPriceAmount: _a, sellPriceCurrency: _c, listingTime: _t, seller: _s, ...rest } = token
		const info = listed.get(token.tokenId)
		if (!info) return rest
		return {
			...rest,
			sellPriceAmount: info.sellPriceAmount,
			sellPriceCurrency: 'LUNA' as const,
			listingTime: info.listingTime,
			seller: info.seller,
			_seq: info.seq,
		}
	})
}

function compareTokenIds(a: string, b: string): number {
	const na = Number(a)
	const nb = Number(b)
	if (Number.isFinite(na) && Number.isFinite(nb) && a.trim() !== '' && b.trim() !== '') return na - nb
	return a.localeCompare(b)
}

/**
 * Listed tokens first, ordered by `sort`; unlisted tokens after them by token id.
 * (Same idea as the old app, but deterministic.)
 */
export function sortTokens<T extends NFTTokenDetails & { _seq?: number }>(tokens: T[], sort: TokenSortType): T[] {
	return [...tokens].sort((t1, t2) => {
		const p1 = t1.sellPriceAmount || 0
		const p2 = t2.sellPriceAmount || 0
		if (!p1 && !p2) return compareTokenIds(t1.tokenId, t2.tokenId)
		if (!p1) return 1
		if (!p2) return -1

		let diff = 0
		const time1 = t1._seq ?? t1.listingTime ?? 0
		const time2 = t2._seq ?? t2.listingTime ?? 0
		switch (sort) {
			case 'PRICE_HIGHEST':
				diff = p2 - p1
				break
			case 'PRICE_LOWEST':
				diff = p1 - p2
				break
			case 'LISTING_NEWEST':
				diff = time2 - time1
				break
			case 'LISTING_OLDEST':
				diff = time1 - time2
				break
		}
		return diff || compareTokenIds(t1.tokenId, t2.tokenId)
	})
}

/** Filter + merge listings + sort + page, as getTokensInCollection returns it. */
export function buildTokensPage(
	allTokens: NFTTokenDetails[],
	listed: Map<string, ListedInfo>,
	query: Pick<TokensQuery, 'page' | 'traitFilters' | 'sort'>,
	pageSize = PAGE_SIZE
): TokensPage {
	const filtered = allTokens.filter(t => matchesTraitFilters(t, query.traitFilters))
	const sorted = sortTokens(mergeListings(filtered, listed), query.sort)
	const page = Math.max(1, Math.floor(query.page || 1))
	const offset = (page - 1) * pageSize
	const tokens = sorted.slice(offset, offset + pageSize).map(({ _seq, ...t }) => t)
	return {
		tokens,
		pagesCount: Math.ceil(filtered.length / pageSize),
		totalResults: filtered.length,
	}
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

function cleanUrl(url: string | null | undefined): string | undefined {
	const resolved = resolveUri(url)
	return resolved || undefined
}

/** Normalises a twitter handle ("@foo" / "foo") to a URL; URLs pass through. */
export function socialUrl(kind: 'twitter' | 'discord' | 'website', value: string | null | undefined): string | undefined {
	const v = value?.trim()
	if (!v) return undefined
	if (/^https?:\/\//i.test(v)) return v
	if (kind === 'twitter') return `https://x.com/${v.replace(/^@/, '')}`
	if (kind === 'discord') return v.startsWith('discord.') ? `https://${v}` : `https://discord.gg/${v}`
	return `https://${v}`
}

export function collectionResponseToDetails(
	res: CollectionResponse,
	extra: { totalTokensCount?: number; possibleTraits?: { [name: string]: TraitValue[] } } = {}
): NFTCollectionDetails {
	const c = res.collection
	return {
		imageURL: cleanUrl(c.image) ?? '',
		bannerImageURL: cleanUrl(c.banner),
		title: c.name,
		description: c.description ?? '',
		nftContractAddress: res.address,
		totalTokensCount: extra.totalTokensCount ?? 0,
		marketplaceListingStart: c.registered_at * 1000,
		socialLinks: {
			twitter: socialUrl('twitter', c.twitter),
			discord: socialUrl('discord', c.discord),
			website: socialUrl('website', c.website),
		},
		possibleTraits: extra.possibleTraits ?? {},
		isExclusive: false,
		isVideo: false,
		enabled: c.enabled,
		royaltyBps: c.royalty_bps,
		volume: { uluna: fromUluna(res.stats.volume), last24h: fromUluna(res.stats.volume_24h) },
	}
}

/** Average daily volume (LUNA) since the collection was registered. */
export function avgDailyVolume(volumeLuna: number, registeredAtSec: number, nowMs = Date.now()): number {
	const days = (nowMs - registeredAtSec * 1000) / (24 * 3600 * 1000)
	return volumeLuna / Math.max(1, days)
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

const TYPE_TO_KINDS: Record<LatestTransactionsType, ActivityKind[]> = {
	marketplace_execute_order: ['sale', 'accept_bid'],
	marketplace_post_sell_order: ['list', 'update_price'],
	marketplace_post_buy_order: ['bid'],
	marketplace_cancel_order: ['cancel_listing', 'cancel_bid'],
}

const KIND_TO_TYPE: Record<ActivityKind, LatestTransactionsType> = {
	sale: 'marketplace_execute_order',
	accept_bid: 'marketplace_execute_order',
	list: 'marketplace_post_sell_order',
	update_price: 'marketplace_post_sell_order',
	bid: 'marketplace_post_buy_order',
	cancel_listing: 'marketplace_cancel_order',
	cancel_bid: 'marketplace_cancel_order',
}

/** Old type names -> contract kinds; undefined means "no kind filter" (all kinds). */
export function typesToKinds(types: readonly string[] | undefined): ActivityKind[] | undefined {
	if (!types || types.length === 0) return undefined
	const kinds = new Set<ActivityKind>()
	for (const type of types) {
		const mapped = TYPE_TO_KINDS[type as LatestTransactionsType]
		if (mapped) mapped.forEach(k => kinds.add(k))
	}
	return [...kinds]
}

export function kindToType(kind: ActivityKind): LatestTransactionsType {
	return KIND_TO_TYPE[kind] ?? 'marketplace_post_sell_order'
}

/** Buyer and seller of an activity entry, as the UI labels them. */
export function activityParties(a: Pick<Activity, 'kind' | 'actor' | 'counterparty'>): { buyer?: string; seller?: string } {
	const counterparty = a.counterparty ?? undefined
	switch (a.kind) {
		case 'sale':
			return { buyer: a.actor, seller: counterparty }
		case 'accept_bid':
			return { buyer: counterparty, seller: a.actor }
		case 'bid':
		case 'cancel_bid':
			return { buyer: a.actor }
		case 'list':
		case 'update_price':
		case 'cancel_listing':
			return { seller: a.actor }
	}
}

// ---------------------------------------------------------------------------
// Activity pagination
//
// The UI pages with a numeric offset (`currentOffset` = items loaded so far);
// the contract pages with an id cursor (`start_before`). We remember, per
// query, which cursor continues after N items.
// ---------------------------------------------------------------------------

export class CursorBook {
	private cursors = new Map<string, number | null>()
	private order: string[] = []

	constructor(private readonly maxEntries = 500) {}

	private key(queryKey: string, offset: number) {
		return `${queryKey}@${offset}`
	}

	/**
	 * Cursor to continue a query after `offset` items: undefined = start from the
	 * newest, null = nothing more, number = pass as start_before.
	 * Unknown non-zero offsets return undefined (restart), which only happens if
	 * the page was reloaded mid-scroll.
	 */
	get(queryKey: string, offset: number): number | null | undefined {
		if (offset <= 0) return undefined
		const k = this.key(queryKey, offset)
		return this.cursors.has(k) ? this.cursors.get(k)! : undefined
	}

	set(queryKey: string, offset: number, cursor: number | null) {
		const k = this.key(queryKey, offset)
		if (!this.cursors.has(k)) this.order.push(k)
		this.cursors.set(k, cursor)
		while (this.order.length > this.maxEntries) {
			this.cursors.delete(this.order.shift()!)
		}
	}
}
