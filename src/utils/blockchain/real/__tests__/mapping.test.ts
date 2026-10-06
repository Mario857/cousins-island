import { describe, expect, it } from 'vitest'
import type { NFTTokenDetails } from '../../blockchain.interface'
import {
	activityParties,
	applyRarity,
	attributesToTraitValues,
	avgDailyVolume,
	buildTokensPage,
	collectionResponseToDetails,
	computePossibleTraits,
	CursorBook,
	kindToType,
	listingsToMap,
	matchesTraitFilters,
	mergeListings,
	metadataToTokenDetails,
	PAGE_SIZE,
	socialUrl,
	sortTokens,
	typesToKinds,
} from '../mapping'
import type { CollectionResponse, Listing } from '../types'

const NFT = 'terra1collection'
const GW = 'https://gw.example/ipfs/'

function token(id: string, traits: Record<string, string> = {}): NFTTokenDetails {
	return {
		tokenId: id,
		name: `#${id}`,
		imageURL: '',
		nftContractAddress: NFT,
		traits: Object.fromEntries(Object.entries(traits).map(([k, v]) => [k, { value: v, rarity: 0 }])),
	}
}

function listing(id: string, priceLuna: number, seq: number, listedAt = 1_700_000_000 + seq): Listing {
	return {
		collection: NFT,
		token_id: id,
		seller: 'terra1seller',
		price: String(priceLuna * 1_000_000),
		listed_at: listedAt,
		seq,
	}
}

describe('metadata -> token details', () => {
	it('maps on-chain metadata', () => {
		const t = metadataToTokenDetails({
			nftContractAddress: NFT,
			tokenId: '7',
			collectionTitle: 'Cousins',
			gateway: GW,
			metadata: {
				name: 'Cousin #7',
				description: 'A cousin',
				image: 'ipfs://QmImg/7.png',
				attributes: [
					{ trait_type: 'Hat', value: 'Red' },
					{ trait_type: 'Level', value: 3 },
					{ trait_type: '', value: 'skipped' },
					{ trait_type: 'Empty', value: '' },
				],
			},
		})
		expect(t).toMatchObject({
			tokenId: '7',
			name: 'Cousin #7',
			description: 'A cousin',
			imageURL: 'https://gw.example/ipfs/QmImg/7.png',
			nftContractAddress: NFT,
			collectionTitle: 'Cousins',
			isVideo: false,
		})
		expect(t.traits).toEqual({ Hat: { value: 'Red', rarity: 0 }, Level: { value: '3', rarity: 0 } })
	})

	it('falls back to #id, image_data and token_uri images', () => {
		const svg = metadataToTokenDetails({
			nftContractAddress: NFT,
			tokenId: '1',
			metadata: { image_data: '<svg></svg>', name: '  ' },
		})
		expect(svg.name).toBe('#1')
		expect(svg.imageURL.startsWith('data:image/svg+xml')).toBe(true)

		const none = metadataToTokenDetails({ nftContractAddress: NFT, tokenId: '2', metadata: null })
		expect(none).toMatchObject({ name: '#2', imageURL: '', traits: {} })

		const uriImage = metadataToTokenDetails({
			nftContractAddress: NFT,
			tokenId: '3',
			metadata: null,
			tokenUri: 'ipfs://QmX/3.png',
			gateway: GW,
		})
		expect(uriImage.imageURL).toBe('https://gw.example/ipfs/QmX/3.png')
	})

	it('flags videos', () => {
		const t = metadataToTokenDetails({ nftContractAddress: NFT, tokenId: '1', metadata: { image: 'https://x/v.mp4' } })
		expect(t.isVideo).toBe(true)
	})

	it('tolerates malformed attributes', () => {
		expect(attributesToTraitValues(null)).toEqual({})
		expect(attributesToTraitValues([null as never, { trait_type: 'A', value: { x: 1 } }])).toEqual({ A: '{"x":1}' })
	})
})

describe('rarity', () => {
	const tokens = [
		token('1', { Hat: 'Red', Eyes: 'Blue' }),
		token('2', { Hat: 'Red', Eyes: 'Green' }),
		token('3', { Hat: 'Blue', Eyes: 'Green' }),
		token('4', { Hat: 'Red' }),
	]

	it('computes the share of tokens per trait value', () => {
		const possible = computePossibleTraits(tokens)
		expect(possible.Hat).toEqual([
			{ value: 'Red', rarity: 75 },
			{ value: 'Blue', rarity: 25 },
		])
		expect(possible.Eyes).toEqual([
			{ value: 'Green', rarity: 50 },
			{ value: 'Blue', rarity: 25 },
		])
	})

	it('rounds to 2 decimals', () => {
		const possible = computePossibleTraits([token('1', { A: 'x' }), token('2', { A: 'y' }), token('3', { A: 'y' })])
		expect(possible.A).toEqual([
			{ value: 'y', rarity: 66.67 },
			{ value: 'x', rarity: 33.33 },
		])
	})

	it('applies rarity without mutating input', () => {
		const possible = computePossibleTraits(tokens)
		const withRarity = applyRarity(tokens, possible)
		expect(withRarity[0].traits).toEqual({ Hat: { value: 'Red', rarity: 75 }, Eyes: { value: 'Blue', rarity: 25 } })
		expect(tokens[0].traits.Hat.rarity).toBe(0)
	})

	it('handles empty collections', () => {
		expect(computePossibleTraits([])).toEqual({})
	})
})

describe('trait filters', () => {
	const t = token('1', { Hat: 'Red', Eyes: 'Blue' })
	it('matches', () => {
		expect(matchesTraitFilters(t, {})).toBe(true)
		expect(matchesTraitFilters(t, { Hat: [] })).toBe(true)
		expect(matchesTraitFilters(t, { Hat: ['Red', 'Blue'] })).toBe(true)
		expect(matchesTraitFilters(t, { Hat: ['Blue'] })).toBe(false)
		expect(matchesTraitFilters(t, { Hat: ['Red'], Eyes: ['Green'] })).toBe(false)
		expect(matchesTraitFilters(t, { Mouth: ['Smile'] })).toBe(false)
	})
})

describe('listings merge, sort and pagination', () => {
	const tokens = ['1', '2', '3', '4', '5', '10'].map(id => token(id, { Hat: Number(id) % 2 ? 'Red' : 'Blue' }))
	// 3 is listed first (oldest), then 1, then 5
	const listed = listingsToMap([listing('3', 20, 1), listing('1', 5, 2), listing('5', 12, 3)])

	it('maps listings', () => {
		expect(listed.get('1')).toEqual({ sellPriceAmount: 5, listingTime: 1_700_000_002_000, seller: 'terra1seller', seq: 2 })
	})

	it('merges sale data and clears stale prices', () => {
		const stale = { ...token('2'), sellPriceAmount: 99, sellPriceCurrency: 'LUNA' as const, listingTime: 1 }
		const merged = mergeListings([token('1'), stale], listed)
		expect(merged[0]).toMatchObject({ sellPriceAmount: 5, sellPriceCurrency: 'LUNA', seller: 'terra1seller' })
		expect(merged[1].sellPriceAmount).toBeUndefined()
		expect(merged[1].sellPriceCurrency).toBeUndefined()
		expect(merged[1].listingTime).toBeUndefined()
	})

	const ids = (ts: NFTTokenDetails[]) => ts.map(t => t.tokenId)

	it('sorts listed tokens first, then unlisted by numeric id', () => {
		const merged = mergeListings(tokens, listed)
		expect(ids(sortTokens(merged, 'PRICE_LOWEST'))).toEqual(['1', '5', '3', '2', '4', '10'])
		expect(ids(sortTokens(merged, 'PRICE_HIGHEST'))).toEqual(['3', '5', '1', '2', '4', '10'])
		expect(ids(sortTokens(merged, 'LISTING_NEWEST'))).toEqual(['5', '1', '3', '2', '4', '10'])
		expect(ids(sortTokens(merged, 'LISTING_OLDEST'))).toEqual(['3', '1', '5', '2', '4', '10'])
	})

	it('filters and paginates', () => {
		const page = buildTokensPage(tokens, listed, { page: 1, traitFilters: { Hat: ['Red'] }, sort: 'PRICE_LOWEST' }, 2)
		expect(ids(page.tokens)).toEqual(['1', '5'])
		expect(page.totalResults).toBe(3)
		expect(page.pagesCount).toBe(2)
		expect((page.tokens[0] as { _seq?: number })._seq).toBeUndefined()

		const page2 = buildTokensPage(tokens, listed, { page: 2, traitFilters: { Hat: ['Red'] }, sort: 'PRICE_LOWEST' }, 2)
		expect(ids(page2.tokens)).toEqual(['3'])

		const beyond = buildTokensPage(tokens, listed, { page: 5, traitFilters: {}, sort: 'PRICE_LOWEST' }, 2)
		expect(beyond.tokens).toEqual([])
	})

	it('uses 21 per page by default', () => {
		const many = Array.from({ length: 50 }, (_, i) => token(String(i)))
		const page = buildTokensPage(many, new Map(), { page: 3, traitFilters: {}, sort: 'LISTING_NEWEST' })
		expect(PAGE_SIZE).toBe(21)
		expect(page.pagesCount).toBe(3)
		expect(page.tokens).toHaveLength(8)
		expect(page.tokens[0].tokenId).toBe('42')
	})
})

describe('collections', () => {
	const res: CollectionResponse = {
		address: NFT,
		collection: {
			name: 'Cousins',
			description: null,
			image: 'ipfs://QmLogo',
			banner: 'https://x/banner.png',
			website: 'cousins.io',
			twitter: '@cousins',
			discord: 'https://discord.gg/abc',
			royalty_bps: 450,
			royalty_recipient: 'terra1royalty',
			enabled: true,
			registered_at: 1_700_000_000,
		},
		stats: { volume: '1500000', volume_24h: '500000', sales: 2, listed: 1, floor_price: '1000000' },
	}

	it('maps the registered collection', () => {
		const c = collectionResponseToDetails(res, { totalTokensCount: 42 })
		expect(c).toMatchObject({
			imageURL: `https://ipfs.io/ipfs/QmLogo`,
			bannerImageURL: 'https://x/banner.png',
			title: 'Cousins',
			description: '',
			nftContractAddress: NFT,
			totalTokensCount: 42,
			marketplaceListingStart: 1_700_000_000_000,
			socialLinks: { twitter: 'https://x.com/cousins', discord: 'https://discord.gg/abc', website: 'https://cousins.io' },
			possibleTraits: {},
			isExclusive: false,
			isVideo: false,
			royaltyBps: 450,
			volume: { uluna: 1.5, last24h: 0.5 },
		})
	})

	it('normalises social links', () => {
		expect(socialUrl('twitter', 'https://twitter.com/x')).toBe('https://twitter.com/x')
		expect(socialUrl('discord', 'abc')).toBe('https://discord.gg/abc')
		expect(socialUrl('website', '')).toBeUndefined()
	})

	it('computes average daily volume', () => {
		const day = 24 * 3600 * 1000
		expect(avgDailyVolume(100, 0, 10 * day)).toBe(10)
		// Less than a day old: whole volume
		expect(avgDailyVolume(100, 0, day / 2)).toBe(100)
	})
})

describe('activity', () => {
	it('maps old type names to kinds', () => {
		expect(typesToKinds(undefined)).toBeUndefined()
		expect(typesToKinds([])).toBeUndefined()
		expect(typesToKinds(['marketplace_execute_order'])).toEqual(['sale', 'accept_bid'])
		expect(typesToKinds(['marketplace_post_sell_order', 'marketplace_post_buy_order'])).toEqual([
			'list',
			'update_price',
			'bid',
		])
		expect(typesToKinds(['marketplace_cancel_order'])).toEqual(['cancel_listing', 'cancel_bid'])
		expect(typesToKinds(['unknown'])).toEqual([])
	})

	it('maps kinds back to old type names', () => {
		expect(kindToType('sale')).toBe('marketplace_execute_order')
		expect(kindToType('accept_bid')).toBe('marketplace_execute_order')
		expect(kindToType('list')).toBe('marketplace_post_sell_order')
		expect(kindToType('update_price')).toBe('marketplace_post_sell_order')
		expect(kindToType('bid')).toBe('marketplace_post_buy_order')
		expect(kindToType('cancel_bid')).toBe('marketplace_cancel_order')
		expect(kindToType('cancel_listing')).toBe('marketplace_cancel_order')
	})

	it('derives buyer and seller', () => {
		expect(activityParties({ kind: 'sale', actor: 'buyer', counterparty: 'seller' })).toEqual({ buyer: 'buyer', seller: 'seller' })
		expect(activityParties({ kind: 'accept_bid', actor: 'seller', counterparty: 'buyer' })).toEqual({ buyer: 'buyer', seller: 'seller' })
		expect(activityParties({ kind: 'bid', actor: 'bidder', counterparty: null })).toEqual({ buyer: 'bidder' })
		expect(activityParties({ kind: 'list', actor: 'seller' })).toEqual({ seller: 'seller' })
	})

	it('remembers cursors per query and offset', () => {
		const book = new CursorBook(3)
		expect(book.get('q', 0)).toBeUndefined()
		expect(book.get('q', 20)).toBeUndefined()
		book.set('q', 20, 105)
		book.set('q', 40, null)
		expect(book.get('q', 20)).toBe(105)
		expect(book.get('q', 40)).toBeNull()
		expect(book.get('other', 20)).toBeUndefined()
		// offset 0 always starts from the newest
		book.set('q', 0, 1)
		expect(book.get('q', 0)).toBeUndefined()
		// evicts the oldest entries
		book.set('r', 1, 1)
		book.set('s', 1, 1)
		expect(book.get('q', 20)).toBeUndefined()
	})
})
