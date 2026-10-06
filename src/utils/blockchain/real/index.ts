import { getNetwork } from 'config/networks'
import type {
	Balance,
	Bid,
	BidRequest,
	BlockchainModule,
	CollectionsVolumes,
	NFTTokenDetails,
	NFTTokenTradingDetails,
	TerraCurrency,
	TokensPage,
	TokensQuery,
	TxReceipt,
} from '../blockchain.interface'
import { assertLuna, bpsToPercent, fromUluna, LUNA_DENOM, toUluna } from './amounts'
import { errorMessage, getBankBalance } from './chain'
import * as data from './collection-data'
import * as cw721 from './cw721'
import { avgDailyVolume, buildTokensPage, listingsToMap } from './mapping'
import * as marketplace from './marketplace'
import { getTransactionsForToken, getTransactionsForUser, getLatestTransactions } from './activity'
import { getLunaPrice } from './luna-price'
import { getTxResult } from './tx'
import userNotifications from './user-notifications'
import { getWalletAddress, setWallet } from './wallet-session'
import type { ContractBid, Listing, Stats } from './types'

export { PAGE_SIZE } from './mapping'

const ESTIMATED_TX_FEE = '~0.02 LUNA'
const NO_BALANCE_MESSAGE = 'Not needed: bids are paid when placed'
/** Same page size as the account pages use. */
const OWNED_TOKENS_PAGE = 30

// Collections ---------------------------------------------------------------

async function getNFTCollections() {
	return data.getAllCollectionDetails()
}

async function getCollectionsVolumes(): Promise<CollectionsVolumes> {
	if (!marketplace.isDeployed()) return {}
	try {
		const registered = await data.getRegisteredCollections()
		const volumes: CollectionsVolumes = {}
		for (const r of registered) {
			volumes[r.address] = { uluna: fromUluna(r.stats.volume), last24h: fromUluna(r.stats.volume_24h) }
		}
		return volumes
	} catch (e) {
		console.warn(`Could not load collection volumes: ${errorMessage(e)}`)
		return {}
	}
}

function getNFTCollection(nftContractAddress: string, options?: { withTraits?: boolean }) {
	return data.getCollectionDetails(nftContractAddress, options)
}

async function getTokensInCollection(query: TokensQuery): Promise<TokensPage> {
	const [{ tokens }, listings] = await Promise.all([
		data.getCollectionTokens(query.nftContractAddress),
		data.getCollectionListings(query.nftContractAddress).catch(e => {
			// Show the collection without prices rather than nothing.
			console.warn(`Could not load listings of ${query.nftContractAddress}: ${errorMessage(e)}`)
			return [] as Listing[]
		}),
	])
	return buildTokensPage(tokens, listingsToMap(listings), query)
}

/** Stats for a collection; zeros when the marketplace isn't deployed or the query fails. */
async function getStatsOrNull(nftContractAddress: string): Promise<Stats | null> {
	if (!marketplace.isDeployed()) return null
	try {
		return await marketplace.getStats(nftContractAddress)
	} catch (e) {
		console.warn(`Could not load stats of ${nftContractAddress}: ${errorMessage(e)}`)
		return null
	}
}

async function getFloorPriceInCollection(nftContractAddress: string): Promise<number> {
	return fromUluna((await getStatsOrNull(nftContractAddress))?.floor_price)
}

async function getLast24hVolumeInCollection(nftContractAddress: string): Promise<number> {
	return fromUluna((await getStatsOrNull(nftContractAddress))?.volume_24h)
}

async function getTotalVolumeInCollection(nftContractAddress: string): Promise<number> {
	return fromUluna((await getStatsOrNull(nftContractAddress))?.volume)
}

async function getAvgDailyVolumeInCollection(nftContractAddress: string): Promise<number> {
	if (!marketplace.isDeployed()) return 0
	try {
		const registered = await data.findRegisteredCollection(nftContractAddress)
		if (!registered) return 0
		return avgDailyVolume(fromUluna(registered.stats.volume), registered.collection.registered_at)
	} catch (e) {
		console.warn(`Could not load volume of ${nftContractAddress}: ${errorMessage(e)}`)
		return 0
	}
}

// Token page ----------------------------------------------------------------

async function getTokenDetails(nftContractAddress: string, tokenId: string): Promise<NFTTokenDetails> {
	const [details, listing] = await Promise.all([
		data.getTokenDetailsWithRarity(nftContractAddress, tokenId),
		marketplace.isDeployed()
			? marketplace.getListing(nftContractAddress, tokenId).catch(() => null)
			: Promise.resolve(null),
	])
	if (!listing) return details
	return {
		...details,
		sellPriceAmount: fromUluna(listing.price),
		sellPriceCurrency: 'LUNA',
		listingTime: listing.listed_at * 1000,
		seller: listing.seller,
	}
}

async function getTokenTradingDetailsForUser(nftContractAddress: string, tokenId: string): Promise<NFTTokenTradingDetails> {
	const deployed = marketplace.isDeployed()
	const [listing, cw721Owner, userAddress, config, registered] = await Promise.all([
		deployed ? marketplace.getListing(nftContractAddress, tokenId) : Promise.resolve(null),
		cw721.getOwnerOf(nftContractAddress, tokenId),
		getWalletAddress({ waitMs: 2000, required: false }),
		deployed ? marketplace.getConfig().catch(() => null) : Promise.resolve(null),
		data.findRegisteredCollection(nftContractAddress).catch(() => undefined),
	])

	const owner = listing ? listing.seller : cw721Owner
	const isListed = Boolean(listing)
	const isOwner = Boolean(userAddress) && owner === userAddress
	const tradable = deployed && registered?.collection.enabled !== false && !config?.paused

	return {
		sellPriceAmount: listing ? fromUluna(listing.price) : undefined,
		sellPriceCurrency: listing ? 'LUNA' : undefined,
		owner,
		sellFees: {
			// A listing pays the fees locked in when it was listed.
			luartFee: bpsToPercent(listing?.terms?.fee_bps ?? config?.fee_bps ?? 0),
			royaltyFee: bpsToPercent(
				listing?.terms?.royalty_bps ??
					(registered?.collection.royalty_recipient ? registered.collection.royalty_bps : 0)
			),
			txFee: ESTIMATED_TX_FEE,
		},
		canUserSell: isOwner && !isListed,
		canUserBuy: Boolean(userAddress) && isListed && !isOwner && tradable,
		// Bids work on unlisted tokens too.
		canUserBid: Boolean(userAddress) && !isOwner && tradable,
		doesUserOwnIt: isOwner,
	}
}

async function buyNow(nftContractAddress: string, tokenId: string, amount: number, currency: TerraCurrency): Promise<TxReceipt> {
	assertLuna(currency)
	const listing = await marketplace.getListing(nftContractAddress, tokenId)
	if (!listing) throw new Error('This NFT is no longer for sale')
	// Pay the exact on-chain price; refuse if it changed since the page loaded
	// (or if the page never showed a price).
	if (!amount || Math.abs(Number(toUluna(amount)) - Number(listing.price)) > 1) {
		throw new Error(`The price changed to ${fromUluna(listing.price)} LUNA, please reload the page`)
	}
	const receipt = await marketplace.buy(nftContractAddress, tokenId, listing.price)
	data.invalidateListings(nftContractAddress)
	return receipt
}

/** Lists the NFT (sends it to the marketplace). If you already listed it, changes the price. */
async function offerSellPrice(nftContractAddress: string, tokenId: string, amount: number, currency: TerraCurrency): Promise<TxReceipt> {
	const user = await getWalletAddress()
	const existing = await marketplace.getListing(nftContractAddress, tokenId)
	const receipt =
		existing && existing.seller === user
			? await marketplace.updatePrice(nftContractAddress, tokenId, amount, currency)
			: await marketplace.list(nftContractAddress, tokenId, amount, currency)
	data.invalidateListings(nftContractAddress)
	return receipt
}

async function updateSellPrice(nftContractAddress: string, tokenId: string, amount: number, currency: TerraCurrency): Promise<TxReceipt> {
	const receipt = await marketplace.updatePrice(nftContractAddress, tokenId, amount, currency)
	data.invalidateListings(nftContractAddress)
	return receipt
}

async function cancelSelling(nftContractAddress: string, tokenId: string): Promise<TxReceipt> {
	const receipt = await marketplace.cancelListing(nftContractAddress, tokenId)
	data.invalidateListings(nftContractAddress)
	return receipt
}

async function transferToken(nftContractAddress: string, tokenId: string, recipientAddress: string): Promise<TxReceipt> {
	if (marketplace.isDeployed()) {
		const listing = await marketplace.getListing(nftContractAddress, tokenId).catch(() => null)
		if (listing) throw new Error('Cancel the listing before transferring this NFT')
	}
	return cw721.transferToken(nftContractAddress, tokenId, recipientAddress)
}

function getTokenMetadataFromBlockchain(nftContractAddress: string, tokenId: string) {
	return cw721.getNftInfo(nftContractAddress, tokenId)
}

// Account -------------------------------------------------------------------

async function getTokensOnWalletForUserInCollection(nftContractAddress: string, startAfterTokenId?: string): Promise<NFTTokenDetails[]> {
	const user = await getWalletAddress()
	const ids = await cw721.getTokenIdsOwnedBy(nftContractAddress, user, startAfterTokenId, OWNED_TOKENS_PAGE)
	return data.getTokensDetails(nftContractAddress, ids)
}

async function getTokensOnWalletForUser(): Promise<NFTTokenDetails[]> {
	if (!marketplace.isDeployed()) return []
	const user = await getWalletAddress()
	const collections = await data.getRegisteredCollections()
	const perCollection = await Promise.all(
		collections.map(async c => {
			try {
				const ids = await cw721.getAllTokenIdsOwnedBy(c.address, user)
				return await data.getTokensDetails(c.address, ids)
			} catch (e) {
				console.warn(`Could not load your tokens in ${c.address}: ${errorMessage(e)}`)
				return []
			}
		})
	)
	return perCollection.flat()
}

async function getTokensOwnedByUserCountInCollection(nftContractAddress: string): Promise<number> {
	const user = await getWalletAddress()
	return (await cw721.getAllTokenIdsOwnedBy(nftContractAddress, user)).length
}

/** NFTs the user has listed (they are held by the marketplace while listed). */
async function getTokensOnSellForUser(): Promise<NFTTokenDetails[]> {
	if (!marketplace.isDeployed()) return []
	const user = await getWalletAddress()
	const listings = await marketplace.getListingsBySeller(user)
	const byCollection = new Map<string, Listing[]>()
	for (const l of listings) byCollection.set(l.collection, [...(byCollection.get(l.collection) ?? []), l])
	const result = await Promise.all(
		[...byCollection.entries()].map(async ([collection, ls]) => {
			const details = await data.getTokensDetails(collection, ls.map(l => l.token_id))
			return details.map((d, i) => ({
				...d,
				sellPriceAmount: fromUluna(ls[i].price),
				sellPriceCurrency: 'LUNA' as const,
				listingTime: ls[i].listed_at * 1000,
				seller: ls[i].seller,
			}))
		})
	)
	return result.flat().sort((a, b) => (b.listingTime ?? 0) - (a.listingTime ?? 0))
}

async function getWithdrawableBalance(): Promise<Balance> {
	return { LUNA: 0, UST: 0 }
}

async function withdraw(): Promise<TxReceipt> {
	throw new Error(NO_BALANCE_MESSAGE)
}

async function depositTokensOnMarketplace(): Promise<TxReceipt> {
	throw new Error(NO_BALANCE_MESSAGE)
}

// Bids ----------------------------------------------------------------------

async function bidsToUiBids(bids: ContractBid[]): Promise<Bid[]> {
	const byCollection = new Map<string, string[]>()
	for (const b of bids) byCollection.set(b.collection, [...(byCollection.get(b.collection) ?? []), b.token_id])
	const details = new Map<string, NFTTokenDetails>()
	await Promise.all(
		[...byCollection.entries()].map(async ([collection, ids]) => {
			try {
				const tokens = await data.getTokensDetails(collection, [...new Set(ids)])
				tokens.forEach(t => details.set(`${collection}/${t.tokenId}`, t))
			} catch (e) {
				console.warn(`Could not load tokens for bids in ${collection}: ${errorMessage(e)}`)
			}
		})
	)
	return bids.map(b => {
		const token = details.get(`${b.collection}/${b.token_id}`)
		return {
			creatorAddress: b.bidder,
			isActive: true,
			bidOrderId: String(b.id),
			timestamp: b.created_at * 1000,
			tokenDetails: {
				...token,
				name: token?.name ?? `#${b.token_id}`,
				imageURL: token?.imageURL ?? '',
				collectionTitle: token?.collectionTitle ?? '',
				isExclusive: false,
			},
			nftContractAddress: b.collection,
			tokenId: b.token_id,
			amount: fromUluna(b.amount),
			currency: 'LUNA',
		}
	})
}

async function postBid(bidRequest: BidRequest): Promise<TxReceipt> {
	return marketplace.placeBid(bidRequest.nftContractAddress, bidRequest.tokenId, bidRequest.amount, bidRequest.currency)
}

function parseBidId(bidOrderId: string): number {
	const id = Number(bidOrderId)
	if (!Number.isSafeInteger(id) || id <= 0) throw new Error(`Invalid bid id: ${bidOrderId}`)
	return id
}

async function cancelBid(bidOrderId: string): Promise<TxReceipt> {
	return marketplace.cancelBid(parseBidId(bidOrderId))
}

/** Highest first. */
async function getAllBidsForToken(nftContractAddress: string, tokenId: string): Promise<Bid[]> {
	if (!marketplace.isDeployed()) return []
	return bidsToUiBids(await marketplace.getBidsForToken(nftContractAddress, tokenId))
}

/** Newest first. Defaults to the connected wallet. */
async function getAllBidsForUser(address?: string): Promise<Bid[]> {
	if (!marketplace.isDeployed()) return []
	const bidder = address || (await getWalletAddress())
	return bidsToUiBids(await marketplace.getBidsByBidder(bidder))
}

/** Sell to a bid: accept_bid when you listed the NFT, otherwise send the NFT from your wallet. */
async function executeBid(bidOrderId: string): Promise<TxReceipt> {
	const bidId = parseBidId(bidOrderId)
	const user = await getWalletAddress()
	const bid = await marketplace.getBid(bidId)
	if (!bid) throw new Error('This bid no longer exists')
	const listing = await marketplace.getListing(bid.collection, bid.token_id)
	let receipt: TxReceipt
	if (listing) {
		if (listing.seller !== user) throw new Error('Only the seller can accept bids on this NFT')
		receipt = await marketplace.acceptBidOnListing(bidId)
	} else {
		const owner = await cw721.getOwnerOf(bid.collection, bid.token_id)
		if (owner !== user) throw new Error('You no longer own this NFT')
		receipt = await marketplace.acceptBidWithNft(bid.collection, bid.token_id, bidId)
	}
	data.invalidateListings(bid.collection)
	return receipt
}

// Balances ------------------------------------------------------------------

async function getBalanceLUNA(): Promise<number> {
	const address = await getWalletAddress()
	return fromUluna(await getBankBalance(address, LUNA_DENOM))
}

async function zero(): Promise<number> {
	return 0
}

async function isTestnet(): Promise<boolean> {
	return getNetwork().isTestnet
}

const blockchainModule: BlockchainModule = {
	// Main page (all collections)
	getNFTCollections,
	getCollectionsVolumes,

	// Collection page
	getNFTCollection,
	getTokensInCollection,
	getFloorPriceInCollection,
	getAvgDailyVolumeInCollection,
	getLast24hVolumeInCollection,
	getTotalVolumeInCollection,

	// NFT token page
	getTokenDetails,
	getTokenTradingDetailsForUser,
	buyNow,
	offerSellPrice,
	updateSellPrice,
	cancelSelling,
	transferToken,
	getTokenMetadataFromBlockchain,
	getTransactionsForToken,

	// My account
	getTokensOnWalletForUserInCollection,
	getTokensOnWalletForUser,
	getTokensOwnedByUserCountInCollection,
	getTokensOnSellForUser,
	getLuaPowerBalance: zero,
	getLuaPowerRanking: zero,
	getWithdrawableBalance,
	withdraw,
	getTransactionsForUser,

	// Activity page
	getLatestTransactions,

	// Bids
	postBid,
	cancelBid,
	getAllBidsForToken,
	getAllBidsForUser,
	executeBid,
	depositTokensOnMarketplace,

	// Notifications
	getNewNotifications: userNotifications.getNewNotifications,
	markNotificationsAsViewed: userNotifications.markNotificationsAsViewed,
	hasUnreadNotifications: userNotifications.hasUnreadNotifications,

	getBalanceUST: zero,
	getBalanceLUNA,
	getBalanceLUART: zero,

	setWallet,
	isTestnet,
	getTxResult,
	getLunaPrice,
}

export default blockchainModule
