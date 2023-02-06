import redstone from 'redstone-api'
import lscache from 'lscache'
import {
	BlockchainModule,
	TokensQuery,
	NFTTokenDetails,
	TokenSortType,
	LatestTransactionsQuery,
	LatestTransactionDetails,
} from '../blockchain.interface'
import cw721 from './contracts/cw721'
import marketplace, { ListedTokens } from './contracts/marketplace'
import luartApi from './luart-api'
import luartCdn from './luart-cdn'
import terraUtils from './terra-utils'
import userNotifications from './user-notifications'
import mockBlockchainModule from '../mock'
import luart from './contracts/luart'

const PAGE_SIZE = 21
const DEFAULT_LUNA_VALUE_USD = 90

export async function getLunaPrice() {
	let lunaPrice = DEFAULT_LUNA_VALUE_USD
	try {
		console.log('Fetching latest LUNA price in USD')
		lunaPrice = (await redstone.getPrice('LUNA')).value
		console.log(`Using luna price: ${lunaPrice}`)
	} catch (e) {
		console.warn(
			`Failed to get price from redstone. Using default value for LUNA: ${DEFAULT_LUNA_VALUE_USD}`
		)
	}

	return lunaPrice
}

// TODO: add connection to luart API
async function getTokensInCollection(query: TokensQuery): Promise<{
	tokens: NFTTokenDetails[]
	pagesCount: number
	totalResults: number
}> {
	// TODO: add support for multiple selected trait values later
	function matchFilters(t: NFTTokenDetails) {
		for (const [traitName, supportedTraitValues] of Object.entries(
			query.traitFilters
		)) {
			const curTraitValue = t.traits[traitName]?.value
			if (
				(supportedTraitValues as any).length > 0 &&
				!(supportedTraitValues as any).includes(curTraitValue)
			) {
				return false
			}
		}
		return true
	}

	let lunaPrice = await getLunaPrice()

	function getSellPriceInUsd(t: NFTTokenDetails) {
		if (t.sellPriceCurrency == 'LUNA') {
			return (t.sellPriceAmount || 0) * lunaPrice
		} else {
			return t.sellPriceAmount || 0
		}
	}

	const fetchedTokenDetails = await luartCdn.fetchCollectionMetadata(
		query.nftContractAddress
	)

	// TODO: improve it in future: fetch listed nfts automatically in background
	lscache.flushExpired()
	const cacheKeyForListedTokens = query.nftContractAddress + query.sort
	const listedTokens =
		lscache.get(cacheKeyForListedTokens) ||
		(await getListedTokens(query.nftContractAddress, query.sort))

	lscache.set(
		cacheKeyForListedTokens,
		listedTokens,
		0.2 /* 0.2 minutes ~ 12 seconds */
	)

	const allTokens = Object.values(fetchedTokenDetails)
	const filteredTokens = allTokens.filter(matchFilters)
	const pagesCount = Math.ceil(filteredTokens.length / PAGE_SIZE)
	const offset = (query.page - 1) * PAGE_SIZE
	const tokensWithSellPrice = filteredTokens.map(t => {
		const listedTokenDetails = listedTokens[t.tokenId]
		if (listedTokenDetails) {
			t.sellPriceAmount = listedTokenDetails.sellPriceAmount
			t.sellPriceCurrency = listedTokenDetails.sellPriceCurrency
			t.listingTime = listedTokenDetails.listingTime
		} else {
			if (t.sellPriceAmount && t.sellPriceCurrency) {
				delete t.sellPriceAmount
				delete t.sellPriceCurrency
				delete t.listingTime
			}
		}
		return t
	})

	// More info how the sorting works: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	tokensWithSellPrice.sort((t1, t2) => {
		const sellPrice1 = getSellPriceInUsd(t1) || 0
		const sellPrice2 = getSellPriceInUsd(t2) || 0
		const listedTime1 = t1.listingTime || 0
		const listedTime2 = t2.listingTime || 0

		if (!sellPrice1) {
			// t1 should go later
			return 1
		}

		if (!sellPrice2) {
			// t2 should go later
			return -1
		}

		if (query.sort == 'PRICE_HIGHEST') {
			return sellPrice2 - sellPrice1
		} else if (query.sort == 'PRICE_LOWEST') {
			return sellPrice1 - sellPrice2
		} else if (query.sort == 'LISTING_NEWEST') {
			return listedTime2 - listedTime1
		} else if (query.sort == 'LISTING_OLDEST') {
			return listedTime1 - listedTime2
		} else {
			return 0
		}
	})

	const slicedTokens = tokensWithSellPrice.slice(offset, offset + PAGE_SIZE)

	return {
		tokens: slicedTokens,
		pagesCount,
		totalResults: filteredTokens.length,
	}
}

async function getListedTokens(
	nftContractAddress: string,
	sort: TokenSortType
): Promise<ListedTokens> {
	// Try to load from API
	// If fails - load from blockchain
	try {
		// Load from price indexer api and from blockchain at the same time
		const promises = [
			luartApi.getListedTokens(nftContractAddress),
			marketplace.getListedTokens(nftContractAddress, sort, 1),
		]
		const responses = await Promise.all(promises)
		const listedTokensResult: ListedTokens = {}

		// Combine responses
		for (const response of responses as ListedTokens[]) {
			for (const tokenId of Object.keys(response)) {
				if (!listedTokensResult[tokenId]) {
					listedTokensResult[tokenId] = response[tokenId]
				}
			}
		}
		return listedTokensResult
	} catch (e) {
		console.warn(
			`Failed to load prices from luart api. Loading from smart contracts...`
		)
		return await marketplace.getListedTokens(nftContractAddress, sort)
	}
}

export async function getTokenDetails(
	nftContractAddress: string,
	tokenId: string
): Promise<NFTTokenDetails> {
	const collectionMetadata = await luartCdn.fetchCollectionMetadata(
		nftContractAddress
	)

	let tokenDetails = collectionMetadata[tokenId]

	const collectionDetails = await luartCdn.getRegisteredCollection(
		nftContractAddress
	)

	tokenDetails.isVideo = collectionDetails?.isVideo || false

	const listOfDynamicTraits = collectionDetails.listOfDynamicTraits

	// Get dynamic traits values from blockchain
	if (listOfDynamicTraits && listOfDynamicTraits?.length > 0) {
		const tokenMetadataFromBlockchain =
			await cw721.getTokenMetadataFromBlockchain(nftContractAddress, tokenId)

		const traitsFromBlockchain = tokenMetadataFromBlockchain.extension.attributes

		for (const trait of listOfDynamicTraits) {
			const traitName = trait.name

			const traitFromBlockchain = traitsFromBlockchain.find(
				(traitFromBlockchain: any) => traitFromBlockchain.trait_type === traitName
			)

			if (traitFromBlockchain) {
				tokenDetails = {
					...tokenDetails,
					traits: {
						...tokenDetails.traits,
						[traitName]: {
							value: trait.format
								? trait.format(traitFromBlockchain.value)
								: traitFromBlockchain.value,
							rarity: 0, // No data about rarity
						},
					},
				}
			}
		}
	}

	const listOfHiddenTraits = collectionDetails.listOfHiddenTraits

	// Hide traits
	if (listOfHiddenTraits && listOfHiddenTraits?.length > 0) {
		for (const traitName of listOfHiddenTraits) {
			delete tokenDetails.traits[traitName]
		}
	}

	if (!tokenDetails.name) tokenDetails.name = `#${tokenDetails.tokenId}`

	return tokenDetails
}

async function getLatestTransactions(query: LatestTransactionsQuery): Promise<{
	latestTransactions: LatestTransactionDetails[]
	currentOffset: number
}> {
	const txs = await luartApi.getLatestMarketplaceTransactions(query)

	return {
		latestTransactions: txs,
		currentOffset: (query.offset || 0) + query.limit,
	}
}

const blockchainModule: BlockchainModule = {
	...mockBlockchainModule,
	// Main page (all collections)
	getNFTCollections: luartCdn.getRegisteredCollections,
	getCollectionsVolumes: luartApi.getCollectionsVolumes,

	// Collection page
	getNFTCollection: luartCdn.getRegisteredCollection,
	getTokensInCollection, // TODO: connect it to API later
	getFloorPriceInCollection: luartApi.getFloorPriceInCollection,
	getAvgDailyVolumeInCollection: luartApi.getAvgDailyVolumeInCollection,
	getLast24hVolumeInCollection: luartApi.getLast24hVolumeInCollection,
	getTotalVolumeInCollection: luartApi.getTotalVolumeInCollection,

	// NFT token page
	getTokenDetails,
	getTokenTradingDetailsForUser: marketplace.getTokenTradingDetailsForUser,
	buyNow: marketplace.buyNow,
	offerSellPrice: marketplace.offerSellPrice,
	cancelSelling: marketplace.cancelSelling,
	transferToken: cw721.transferToken,
	getTokenMetadataFromBlockchain: cw721.getTokenMetadataFromBlockchain,
	getTransactionsForToken: luartApi.getTransactionsForToken,

	// My account
	getTokensOnWalletForUserInCollection:
		cw721.getTokensOnWalletForUserInCollection,
	getTokensOnWalletForUser: cw721.getTokensOnWalletForUser,
	getTokensOwnedByUserCountInCollection:
		cw721.getTokensOwnedByUserCountInCollection,
	getTokensOnSellForUser: marketplace.getTokensOnSellForUser,
	getLuaPowerBalance: luartApi.getLuaPowerBalance,
	getLuaPowerRanking: luartApi.getLuaPowerRanking,
	getWithdrawableBalance: marketplace.getWithdrawableBalance,
	withdraw: marketplace.withdraw,
	getTransactionsForUser: luartApi.getTransactionsForUser,

	// Activity page
	getLatestTransactions,

	// Bidding functions
	postBid: marketplace.postBid,
	cancelBid: marketplace.cancelBid,
	getAllBidsForToken: marketplace.getAllBidsForToken,
	getAllBidsForUser: marketplace.getAllBidsForUser,
	executeBid: marketplace.executeBid,
	depositTokensOnMarketplace: marketplace.depositTokensOnMarketplace,

	// User notifications
	getNewNotifications: userNotifications.getNewNotifications,
	markNotificationsAsViewed: userNotifications.markNotificationsAsViewed,
	hasUnreadNotifications: userNotifications.hasUnreadNotifications,

	getBalanceUST: terraUtils.getBalanceUST,
	getBalanceLUNA: terraUtils.getBalanceLUNA,
	getBalanceLUART: luart.getBalanceLUART,

	setWallet: terraUtils.setWallet,

	isTestnet: terraUtils.isTestnet,

	getTxResult: terraUtils.getTxResult,

	getLunaPrice,
}

export default blockchainModule
