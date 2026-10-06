// JSON shapes of the Cousins marketplace contract (contracts/marketplace) and
// cw721 v0.20 (cw721-metadata-onchain). Uint128 values are strings; timestamps
// are unix seconds.

export type Uint128 = string

export interface MarketplaceConfig {
	admin: string
	fee_bps: number
	fee_recipient: string
	denom: string
	paused: boolean
}

export interface MarketplaceCollection {
	name: string
	description?: string | null
	image?: string | null
	banner?: string | null
	website?: string | null
	twitter?: string | null
	discord?: string | null
	royalty_bps: number
	royalty_recipient?: string | null
	enabled: boolean
	registered_at: number
}

export interface Stats {
	volume: Uint128
	volume_24h: Uint128
	sales: number
	listed: number
	floor_price?: Uint128 | null
	last_sale_price?: Uint128 | null
	last_sale_at?: number | null
}

export interface CollectionResponse {
	address: string
	collection: MarketplaceCollection
	stats: Stats
}

export interface Listing {
	collection: string
	token_id: string
	seller: string
	price: Uint128
	listed_at: number
	seq: number
	/** Fee and royalty locked in when the NFT was listed. */
	terms: { fee_bps: number; royalty_bps: number; royalty_recipient: string | null }
}

export interface ContractBid {
	id: number
	collection: string
	token_id: string
	bidder: string
	amount: Uint128
	created_at: number
}

export type ActivityKindJson = 'list' | 'update_price' | 'cancel_listing' | 'sale' | 'bid' | 'cancel_bid' | 'accept_bid'

export interface Activity {
	id: number
	kind: ActivityKindJson
	collection: string
	token_id: string
	actor: string
	counterparty?: string | null
	price: Uint128
	timestamp: number
	height: number
}

export type ListingSortJson = 'price_asc' | 'price_desc' | 'newest' | 'oldest'

export interface ListingCursor {
	token_id: string
	price: Uint128
	seq: number
}

// cw721 ---------------------------------------------------------------------

export interface NftAttribute {
	trait_type?: unknown
	value?: unknown
	display_type?: string | null
}

export interface NftExtension {
	image?: string | null
	image_data?: string | null
	external_url?: string | null
	description?: string | null
	name?: string | null
	attributes?: NftAttribute[] | null
	background_color?: string | null
	animation_url?: string | null
	youtube_url?: string | null
}

export interface NftInfoResponse {
	token_uri?: string | null
	extension?: NftExtension | null
}
