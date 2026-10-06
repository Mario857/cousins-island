import type { WalletSession } from 'wallet'

// Shapes the UI reads. They keep the names of the original Luart/Terra 1 data
// layer so pages and components didn't have to change; the data now comes from
// the Cousins marketplace contract (escrowed listings and bids, LUNA only).

export interface TxReceipt {
	txId: string
	/** Explorer link for the transaction (name kept from the Terra Finder days). */
	txTerraFinderUrl: string
	/** Fee actually paid, e.g. "0.0123 LUNA". */
	txFee: string
}

/** Only LUNA is accepted now. 'UST' stays in the type for old UI code paths and is rejected at runtime. */
export type TerraCurrency = 'LUNA' | 'UST'

export interface TraitValue {
	value: string
	/** Share of tokens in the collection with this value, in percent (0 when unknown). */
	rarity: number
}

export type TokenSortType = 'LISTING_NEWEST' | 'LISTING_OLDEST' | 'PRICE_HIGHEST' | 'PRICE_LOWEST'

export interface NFTTokenDetails {
	tokenId: string
	name: string
	description?: string
	imageURL: string
	/** Video/animation URL from the metadata, if any. */
	animationURL?: string
	nftContractAddress: string
	collectionTitle?: string
	traits: { [traitName: string]: TraitValue }
	sellPriceAmount?: number
	sellPriceCurrency?: TerraCurrency
	/** Listing time in ms (only for listed tokens). */
	listingTime?: number
	/** Seller address (only for listed tokens). */
	seller?: string
	isVideo?: boolean
	isExclusive?: boolean
}

export interface RelatedCollection {
	title: string
	nftContractAddress: string
}

export interface CollectionVolume {
	/** Total traded volume in LUNA (the key name is historical: it was never in micro units in the UI). */
	uluna: number
	/** Volume over the last 24h, in LUNA. */
	last24h: number
}

export type CollectionsVolumes = { [nftContractAddress: string]: CollectionVolume }

export interface NFTCollectionDetails {
	imageURL: string
	bannerImageURL?: string
	title: string
	description: string
	nftContractAddress: string
	totalTokensCount: number
	/** ms timestamp; collections with a future start are hidden from the public lists. */
	marketplaceListingStart: number
	socialLinks?: {
		twitter?: string
		discord?: string
		website?: string
	}
	possibleTraits: { [traitName: string]: TraitValue[] }
	isExclusive?: boolean
	isVideo?: boolean
	/** Disabled collections can't be traded (existing listings/bids can still be cancelled). */
	enabled?: boolean
	/** Creator royalty in basis points. */
	royaltyBps?: number
	/** Added by the store (getCollections). */
	volume?: CollectionVolume
	// Per-collection UI tweaks from the old curated list; not set by the contract.
	skipTraitsInFilters?: string[]
	listOfHiddenTraits?: string[]
	relatedCollections?: RelatedCollection[]
	isHidden?: boolean
	glitchedNFTs?: string[]
}

export interface TokensQuery {
	nftContractAddress: string
	/** 1-based. */
	page: number
	traitFilters: { [traitName: string]: string[] }
	sort: TokenSortType
}

export interface TokensPage {
	tokens: NFTTokenDetails[]
	pagesCount: number
	totalResults: number
}

export interface NFTTokenTradingDetails {
	sellPriceAmount?: number
	sellPriceCurrency?: TerraCurrency
	/** The seller while listed (the NFT itself is held by the marketplace), otherwise the cw721 owner. */
	owner: string
	sellFees: {
		luartFee: string
		royaltyFee: string
		txFee: string
	}
	canUserSell: boolean
	canUserBuy: boolean
	canUserBid: boolean
	doesUserOwnIt: boolean
}

export interface Balance {
	LUNA: number
	UST: number
}

export interface BidRequest {
	nftContractAddress: string
	tokenId: string
	amount: number
	currency: TerraCurrency
}

export type BidTokenDetails = Partial<NFTTokenDetails> & {
	name: string
	imageURL: string
	collectionTitle: string
	isExclusive?: boolean
}

export interface Bid {
	creatorAddress: string
	isActive: boolean
	/** String(bid.id) of the marketplace bid. */
	bidOrderId: string
	/** ms */
	timestamp: number
	tokenDetails: BidTokenDetails
	nftContractAddress: string
	tokenId: string
	amount: number
	currency: TerraCurrency
}

/**
 * Activity type names from the old Luart indexer, still used by the UI for
 * labels and filters. Mapping to marketplace activity kinds:
 * - marketplace_execute_order   -> sale, accept_bid
 * - marketplace_post_sell_order -> list, update_price
 * - marketplace_post_buy_order  -> bid
 * - marketplace_cancel_order    -> cancel_listing, cancel_bid
 */
export type LatestTransactionsType =
	| 'marketplace_execute_order'
	| 'marketplace_post_sell_order'
	| 'marketplace_post_buy_order'
	| 'marketplace_cancel_order'

/** Activity kinds recorded by the marketplace contract. */
export type ActivityKind =
	| 'list'
	| 'update_price'
	| 'cancel_listing'
	| 'sale'
	| 'bid'
	| 'cancel_bid'
	| 'accept_bid'

export interface LatestTransactionsQuery {
	/** Empty = all types. */
	type: LatestTransactionsType[]
	nftContractAddress?: string
	limit: number
	/** Number of items already loaded (pass back `currentOffset`). */
	offset: number
}

export interface LatestTransactionDetails {
	/** ms */
	timestamp: number
	/** Explorer link: the block on mainnet, the acting account on testnet (no tx hash is stored on chain). */
	terraFinderUrl: string
	tokenDetails: NFTTokenDetails
	price: number
	currency: TerraCurrency
	buyer?: string
	seller?: string
	type: LatestTransactionsType
	/** The precise marketplace activity kind. */
	kind: ActivityKind
	/** Marketplace activity id (unique). */
	id: number
	height: number
}

export interface LatestTransactionsResult {
	latestTransactions: LatestTransactionDetails[]
	currentOffset: number
}

export interface NotificationsResult {
	notifications: LatestTransactionDetails[]
	latestTimestamp: number
}

/**
 * Compatible with what hooks/useBroadcastingTx expects: `data` is set once the
 * tx is in a block, and `data.logs` is non-empty only when it succeeded.
 */
export interface TxResult {
	data: {
		txhash: string
		height: number
		code: number
		logs: { msg_index: number }[]
		rawLog?: string
	}
}

export interface BlockchainModule {
	// Main page (all collections)
	getNFTCollections(): Promise<NFTCollectionDetails[]>
	getCollectionsVolumes(): Promise<CollectionsVolumes>

	// Collection page
	/** `withTraits` (default true) loads every token to compute `possibleTraits`; pass false when only the header data is needed. */
	getNFTCollection(nftContractAddress: string, options?: { withTraits?: boolean }): Promise<NFTCollectionDetails>
	getTokensInCollection(query: TokensQuery): Promise<TokensPage>
	getFloorPriceInCollection(nftContractAddress: string): Promise<number>
	getAvgDailyVolumeInCollection(nftContractAddress: string): Promise<number>
	getLast24hVolumeInCollection(nftContractAddress: string): Promise<number>
	getTotalVolumeInCollection(nftContractAddress: string): Promise<number>

	// NFT token page
	getTokenDetails(nftContractAddress: string, tokenId: string): Promise<NFTTokenDetails>
	getTokenTradingDetailsForUser(nftContractAddress: string, tokenId: string): Promise<NFTTokenTradingDetails>
	buyNow(nftContractAddress: string, tokenId: string, amount: number, currency: TerraCurrency): Promise<TxReceipt>
	offerSellPrice(nftContractAddress: string, tokenId: string, amount: number, currency: TerraCurrency): Promise<TxReceipt>
	updateSellPrice(nftContractAddress: string, tokenId: string, amount: number, currency: TerraCurrency): Promise<TxReceipt>
	cancelSelling(nftContractAddress: string, tokenId: string): Promise<TxReceipt>
	transferToken(nftContractAddress: string, tokenId: string, recipientAddress: string): Promise<TxReceipt>
	getTokenMetadataFromBlockchain(nftContractAddress: string, tokenId: string): Promise<unknown>
	getTransactionsForToken(query: LatestTransactionsQuery, tokenId: string): Promise<LatestTransactionsResult>

	// My account
	getTokensOnWalletForUserInCollection(nftContractAddress: string, startAfterTokenId?: string): Promise<NFTTokenDetails[]>
	getTokensOnWalletForUser(): Promise<NFTTokenDetails[]>
	getTokensOwnedByUserCountInCollection(nftContractAddress: string): Promise<number>
	getTokensOnSellForUser(): Promise<NFTTokenDetails[]>
	getLuaPowerBalance(): Promise<number>
	getLuaPowerRanking(): Promise<number>
	/** Always zero: bids are escrowed when placed, there is no marketplace balance. */
	getWithdrawableBalance(): Promise<Balance>
	/** Always throws: there is no marketplace balance any more. */
	withdraw(amount: number, currency: TerraCurrency): Promise<TxReceipt>
	getTransactionsForUser(query: LatestTransactionsQuery): Promise<LatestTransactionsResult>

	// Activity page
	getLatestTransactions(query: LatestTransactionsQuery): Promise<LatestTransactionsResult>

	// Bids
	postBid(bidRequest: BidRequest): Promise<TxReceipt>
	cancelBid(bidOrderId: string): Promise<TxReceipt>
	getAllBidsForToken(nftContractAddress: string, tokenId: string): Promise<Bid[]>
	getAllBidsForUser(address?: string): Promise<Bid[]>
	executeBid(bidOrderId: string): Promise<TxReceipt>
	/** Always throws: bids are paid when placed. */
	depositTokensOnMarketplace(amount: number, currency: TerraCurrency): Promise<TxReceipt>

	// Notifications
	getNewNotifications(): Promise<NotificationsResult>
	markNotificationsAsViewed(notifications: LatestTransactionDetails[]): number
	hasUnreadNotifications(notifications: LatestTransactionDetails[]): boolean

	// Wallet balances
	getBalanceUST(): Promise<number>
	getBalanceLUNA(): Promise<number>
	getBalanceLUART(): Promise<number>

	setWallet(session: WalletSession | null): void
	isTestnet(): Promise<boolean>
	/** null until the tx is found. */
	getTxResult(txHash: string): Promise<TxResult | null>
	/** LUNA price in USD. */
	getLunaPrice(): Promise<number>
}
