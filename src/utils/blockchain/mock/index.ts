import type {
	Bid,
	BlockchainModule,
	NFTCollectionDetails,
	NFTTokenDetails,
	NFTTokenTradingDetails,
	TokensQuery,
	TxResult,
} from '../blockchain.interface'
import { buildTokensPage, computePossibleTraits, applyRarity } from '../real/mapping'
import utils from './utils'

// In-memory data for working on the UI without a chain. Switch to it in
// blockchain.ts. Transactions resolve with a fake receipt.

const MOCK_COLLECTION_ADDRESS = 'terra1mockcollectionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const MOCK_OWNER = 'terra1mockownerxxxxxxxxxxxxxxxxxxxxxxxxxx'
const BACKGROUNDS = ['Red', 'Blue', 'Green']
const EYES = ['Blue', 'Green']

function mockToken(index: number): NFTTokenDetails {
	return {
		tokenId: String(index),
		name: `Cousin #${index}`,
		imageURL: `https://picsum.photos/seed/cousin-${index}/400/400`,
		nftContractAddress: MOCK_COLLECTION_ADDRESS,
		collectionTitle: 'Mock Cousins',
		traits: {
			background: { value: BACKGROUNDS[index % BACKGROUNDS.length], rarity: 0 },
			eyes: { value: EYES[index % EYES.length], rarity: 0 },
		},
	}
}

const RAW_TOKENS = Array.from({ length: 60 }, (_, i) => mockToken(i + 1))
const POSSIBLE_TRAITS = computePossibleTraits(RAW_TOKENS)
const TOKENS = applyRarity(RAW_TOKENS, POSSIBLE_TRAITS)
const LISTED = new Map(
	TOKENS.filter((_, i) => i % 3 === 0).map((t, i) => [
		t.tokenId,
		{ sellPriceAmount: 5 + i, listingTime: 1_700_000_000_000 + i * 60_000, seller: MOCK_OWNER, seq: i + 1 },
	])
)

function mockCollection(): NFTCollectionDetails {
	return {
		imageURL: 'https://picsum.photos/seed/cousins-logo/200/200',
		bannerImageURL: 'https://picsum.photos/seed/cousins-banner/1200/300',
		title: 'Mock Cousins',
		description: 'A collection that only exists in the mock blockchain module.',
		nftContractAddress: MOCK_COLLECTION_ADDRESS,
		totalTokensCount: TOKENS.length,
		marketplaceListingStart: 1_700_000_000_000,
		socialLinks: {},
		possibleTraits: POSSIBLE_TRAITS,
		isExclusive: false,
		isVideo: false,
		enabled: true,
		royaltyBps: 450,
		volume: { uluna: 1234.5, last24h: 70 },
	}
}

function mockBid(index: number): Bid {
	const token = TOKENS[index % TOKENS.length]
	return {
		creatorAddress: MOCK_OWNER,
		isActive: true,
		bidOrderId: String(index + 1),
		timestamp: 1_700_000_000_000 + index * 3_600_000,
		tokenDetails: { ...token, collectionTitle: token.collectionTitle ?? '' },
		nftContractAddress: token.nftContractAddress,
		tokenId: token.tokenId,
		amount: 10 - index,
		currency: 'LUNA',
	}
}

async function tx() {
	await utils.sleep()
	return utils.getDefaultMockTxReceipt()
}

async function value<T>(v: T): Promise<T> {
	await utils.sleep(300)
	return v
}

const emptyActivity = () => value({ latestTransactions: [], currentOffset: 0 })

const mockBlockchainModule: BlockchainModule = {
	getNFTCollections: () => value([mockCollection()]),
	getCollectionsVolumes: () => value({ [MOCK_COLLECTION_ADDRESS]: { uluna: 1234.5, last24h: 70 } }),

	getNFTCollection: () => value(mockCollection()),
	getTokensInCollection: (query: TokensQuery) => value(buildTokensPage(TOKENS, LISTED, query)),
	getFloorPriceInCollection: () => value(5),
	getAvgDailyVolumeInCollection: () => value(140.45),
	getLast24hVolumeInCollection: () => value(70),
	getTotalVolumeInCollection: () => value(1234.5),

	getTokenDetails: (_address: string, tokenId: string) =>
		value(TOKENS.find(t => t.tokenId === tokenId) ?? mockToken(Number(tokenId) || 1)),
	getTokenTradingDetailsForUser: (_address: string, tokenId: string) => {
		const listed = LISTED.get(tokenId)
		const details: NFTTokenTradingDetails = {
			sellPriceAmount: listed?.sellPriceAmount,
			sellPriceCurrency: listed ? 'LUNA' : undefined,
			owner: MOCK_OWNER,
			sellFees: { luartFee: '2.5%', royaltyFee: '4.5%', txFee: '~0.02 LUNA' },
			canUserSell: false,
			canUserBuy: Boolean(listed),
			canUserBid: true,
			doesUserOwnIt: false,
		}
		return value(details)
	},
	buyNow: tx,
	offerSellPrice: tx,
	updateSellPrice: tx,
	cancelSelling: tx,
	transferToken: tx,
	getTokenMetadataFromBlockchain: () => value({}),
	getTransactionsForToken: emptyActivity,

	getTokensOnWalletForUserInCollection: () => value(TOKENS.slice(0, 2)),
	getTokensOnWalletForUser: () => value(TOKENS.slice(0, 2)),
	getTokensOwnedByUserCountInCollection: () => value(2),
	getTokensOnSellForUser: () => value(TOKENS.slice(3, 5)),
	getLuaPowerBalance: () => value(0),
	getLuaPowerRanking: () => value(0),
	getWithdrawableBalance: () => value({ LUNA: 0, UST: 0 }),
	withdraw: async () => {
		throw new Error('Not needed: bids are paid when placed')
	},
	getTransactionsForUser: emptyActivity,

	getLatestTransactions: emptyActivity,

	postBid: tx,
	cancelBid: tx,
	getAllBidsForToken: () => value([0, 1, 2].map(mockBid)),
	getAllBidsForUser: () => value([0, 1, 2].map(mockBid)),
	executeBid: tx,
	depositTokensOnMarketplace: async () => {
		throw new Error('Not needed: bids are paid when placed')
	},

	getNewNotifications: () => value({ notifications: [], latestTimestamp: 0 }),
	markNotificationsAsViewed: () => 0,
	hasUnreadNotifications: () => false,

	getBalanceUST: () => value(0),
	getBalanceLUNA: () => value(123.45),
	getBalanceLUART: () => value(0),

	setWallet: () => undefined,
	isTestnet: () => value(true),
	getTxResult: (txHash: string) => {
		const result: TxResult = { data: { txhash: txHash, height: 1, code: 0, logs: [{ msg_index: 0 }] } }
		return value(result)
	},
	getLunaPrice: () => value(0.15),
}

export default mockBlockchainModule
