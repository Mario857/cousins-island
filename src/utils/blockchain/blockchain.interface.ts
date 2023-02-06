export interface TxReceipt {
	txId: string
	txTerraFinderUrl: string // TODO: change this for IBC, to more generic name.
	txFee: string
}

// TODO: define these
export type BlockchainModule = any
export type NFTCollectionDetails = any
export type TokensQuery = any
export type NFTTokenDetails = any
export type NFTTokenTradingDetails = any
export type TerraCurrency = any
export type Balance = any
export type BidRequest = any
export type Bid = any
export type TraitValue = any
export type LatestTransactionDetails = any
export type LatestTransactionsQuery = any
export type CollectionsVolumes = any
export type TokenSortType =
	| 'LISTING_NEWEST'
	| 'LISTING_OLDEST'
	| 'PRICE_HIGHEST'
	| 'PRICE_LOWEST'
	| 'PRICE_LOWEST'

export type BidTokenDetails = any
export type LatestTransactionsType = any
export type RelatedCollection = any
