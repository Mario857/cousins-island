import {
	Balance,
	Bid,
	BidRequest,
	NFTTokenDetails,
	NFTTokenTradingDetails,
	TerraCurrency,
	TokenSortType,
	TxReceipt,
} from '../../blockchain.interface'
import addresses from '../addresses'
import luartCdn from '../luart-cdn'
import terraUtils from '../terra-utils'
import cw721 from './cw721'
import _, { add } from 'lodash'
import { getTokenDetails } from '..'

const UST_WITHDRAW_FEE = '250000' // 1 UST

type Order = any // TODO: improve it later

export interface ListedToken {
	tokenId: string
	listingTime: number
	sellPriceAmount: number
	sellPriceCurrency: TerraCurrency
}

export interface ListedTokens {
	[tokenId: string]: ListedToken
}

interface TokensOnPage {
	tokens: any[]
	offset: string
}

const MAX_REQUESTS_COUNT_FOR_LISTED_NFTS = 7
const LIMIT = 30

const STATUSES = {
	ACTIVE: 'active',
	CANCELLED: 'cancelled',
	EXECUTED: 'executed',
	EXPIRED: 'expired',
}

const ORDER_TYPES = {
	SELL: 'sell',
	BUY: 'buy',
}

const LUART_PERCENT_FEE = 2.5
const ROYALTY_PERCENT_FEE = 4.5
const LUART_STABLECOIN_FEE_FOR_SELL_ORDER = { ust: '200000' }
const LUART_STABLECOIN_FEE_FOR_BID = { ust: '100000' }

// We use UST amountConverter, but it also works good for Luna as they both use 6 decimal precision
const amountConverter = terraUtils.amountConverter.ust

async function getTokensOnSellForUser(): Promise<NFTTokenDetails[]> {
	const tokens = []

	// Getting all orders for current user
	const allOrders = await getAllOrdersForUser()

	for (const order of allOrders) {
		// Fetching tokens from active sell orders
		if (order.status == STATUSES.ACTIVE && order.order_type == ORDER_TYPES.SELL) {
			const nftContractAddress = order.order_details.nft_contract_address
			const tokenId = order.order_details.token_id
			const collectionMetadata = await luartCdn.fetchCollectionMetadata(
				nftContractAddress
			)
			if (collectionMetadata[tokenId]) {
				tokens.push(collectionMetadata[tokenId])
			}
		}
	}

	return tokens
}

// Getting all orders from all pages
async function getAllOrdersForUser(
	nftContractAddress?: string
): Promise<Order[]> {
	const allOrders = []
	let finished = false,
		currentOffset: string | undefined

	while (!finished) {
		const { orders, offset } = await getOrdersForUserWithOffset(
			nftContractAddress,
			currentOffset
		)
		allOrders.push(...orders)
		if (orders.length < LIMIT) {
			finished = true
		} else {
			currentOffset = offset
		}
	}

	return allOrders
}

async function getOrdersForUserWithOffset(
	nftContractAddress?: string,
	offset?: string
): Promise<{ orders: Order[]; offset: string }> {
	const address = await terraUtils.getWalletAddress()
	const marketplaceAddress = await addresses.getContractAddress('marketplace')

	// console.log(`Getting orders for user: ${address} with offset: "${offset}"`);
	const response = await terraUtils.sendQuery(marketplaceAddress, {
		orders_for_user: {
			address,
			limit: LIMIT,
			offset,
			nft_contract_address: nftContractAddress,
		},
	})

	return response
}

async function offerSellPrice(
	nftContractAddress: string,
	tokenId: string,
	amount: number,
	currency: TerraCurrency
): Promise<TxReceipt> {
	// console.log({
	//   offerSellPrice: {
	//     nftContractAddress,
	//     tokenId,
	//     amount,
	//     currency,
	//   },
	// });

	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)
	const txs = [
		{
			contractAddress: nftContractAddress,
			message: {
				approve: {
					spender: marketplaceContractAddress,
					token_id: tokenId,
				},
			},
		},
		{
			contractAddress: marketplaceContractAddress,
			message: {
				post_sell_order: {
					order_id: generateRandomOrderId('sell'),
					nft_contract_address: nftContractAddress,
					token_id: tokenId,
					price: amountConverter.userFacingToBlockchainValue(amount),
					denom: getDenomForCurrency(currency),
					expiration: getLongExpiration(),
				},
			},
			coins: LUART_STABLECOIN_FEE_FOR_SELL_ORDER,
		},
	]

	return await terraUtils.postManyTransactions(txs)
}

async function buyNow(
	nftContractAddress: string,
	tokenId: string,
	amount: number,
	currency: TerraCurrency
): Promise<TxReceipt> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)
	const sellOrder = await getSellOrderForToken(nftContractAddress, tokenId)

	const requiredAmount = amountConverter.userFacingToBlockchainValue(amount)

	const txs = [
		{
			contractAddress: marketplaceContractAddress,
			message: {
				add_balance: {
					denom: getDenomForCurrency(currency),
					amount: requiredAmount,
				},
			},
			coins: {
				[currency.toLowerCase()]: requiredAmount,
			},
		},
		{
			contractAddress: marketplaceContractAddress,
			message: {
				execute_order: { order_id: sellOrder!.order_id },
			},
		},
	]

	// Post transactions for buying
	return await terraUtils.postManyTransactions(txs)
}

async function cancelSelling(
	nftContractAddress: string,
	tokenId: string
): Promise<TxReceipt> {
	const sellOrder = await getSellOrderForToken(nftContractAddress, tokenId)
	if (!sellOrder) {
		throw new Error('Can not find any active sell order to cancel')
	}
	const sellOrderId = sellOrder!.order_id
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	return await terraUtils.postTransaction({
		contractAddress: marketplaceContractAddress,
		message: {
			cancel_order: {
				order_id: sellOrderId,
			},
		},
	})
}

async function getSellOrderForToken(
	nftContractAddress: string,
	tokenId: string
): Promise<Order | undefined> {
	const activeOrders = await getActiveOrdersForToken(nftContractAddress, tokenId)

	// console.log({ activeOrders }); // TODO: remove later
	return activeOrders.find(o => o.order_type === ORDER_TYPES.SELL)
}

// TODO: improve querying with paging later
async function getActiveOrdersForToken(
	nftContractAddress: string,
	tokenId: string
): Promise<Order[]> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	const query = {
		orders_for_token: {
			nft_contract_address: nftContractAddress,
			token_id: tokenId,
			only_active: true,
			limit: LIMIT,
			// offset: ,
		},
	}

	const response = await terraUtils.sendQuery(marketplaceContractAddress, query)

	return response.orders
}

async function getTokenTradingDetailsForUser(
	nftContractAddress: string,
	tokenId: string
): Promise<NFTTokenTradingDetails> {
	const sellOrder = await getSellOrderForToken(nftContractAddress, tokenId)
	const ownerAddress = await cw721.getOwnerOfToken(nftContractAddress, tokenId)

	const userAddress = await terraUtils.getWalletAddress(
		10 /* triesCount */,
		200 /* intervalMs */,
		false /* throwIfNoWallet */
	)
	const isOwner = userAddress == ownerAddress

	return {
		sellPriceAmount: sellOrder?.order_details
			? amountConverter.blockchainValueToUserFacing(sellOrder.order_details.price)
			: undefined,
		sellPriceCurrency: sellOrder?.order_details
			? getCurrencyForDenom(sellOrder.order_details?.denom)
			: undefined,
		owner:
			sellOrder && sellOrder?.order_creator
				? sellOrder.order_creator
				: ownerAddress,
		sellFees: {
			luartFee: `${LUART_PERCENT_FEE}%`,
			txFee: '<1 UST',
			royaltyFee: `${ROYALTY_PERCENT_FEE}%`,
		},
		canUserSell: !sellOrder && isOwner,
		canUserBuy: sellOrder && !isOwner,
		canUserBid: sellOrder && !isOwner,
		doesUserOwnIt: isOwner || sellOrder?.order_creator == userAddress,
	}
}

// Helper functions

function generateRandomOrderId(type: 'buy' | 'sell'): string {
	return `${type}_${Date.now()}_${Math.random()}`
}

async function getListedTokens(
	nftContractAddress: string,
	sort: TokenSortType,
	maxRequests?: number
): Promise<ListedTokens> {
	const allListedTokens: ListedTokens = {}
	const maxRequestsCount = maxRequests || MAX_REQUESTS_COUNT_FOR_LISTED_NFTS

	for (const denom of ['uusd', 'uluna']) {
		let finished = false,
			offset,
			counter = 0
		while (!finished) {
			counter++

			if (counter > maxRequestsCount) {
				break
			}

			const nftsOnPage: TokensOnPage = await getListedNftsOnPage(
				nftContractAddress,
				denom,
				sort,
				offset
			)

			if (
				nftsOnPage.tokens.length < LIMIT ||
				(!nftsOnPage.offset && counter > 1)
			) {
				finished = true
			}
			offset = nftsOnPage.offset

			for (const token of nftsOnPage.tokens) {
				if (!token.sell_price) {
					continue
				}

				const sellPriceAmount = amountConverter.blockchainValueToUserFacing(
					token.sell_price.amount
				)

				allListedTokens[token.token_id] = {
					listingTime: token.listing_time,
					tokenId: token.token_id,
					sellPriceAmount,
					sellPriceCurrency: getCurrencyForDenom(token.sell_price.denom),
				}
			}
		}
	}

	// console.log({ allListedTokens });

	return allListedTokens
}

async function getListedNftsOnPage(
	nftContractAddress: string,
	denom: string,
	sort: TokenSortType,
	offset?: string
): Promise<TokensOnPage> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)
	const response = await terraUtils.sendQuery(marketplaceContractAddress, {
		nft_tokens: {
			nft_contract_address: nftContractAddress,
			denom,
			sort: prepareSortParamForMarketplaceSmartContract(sort),
			limit: LIMIT,
			offset,
		},
	})

	return response
}

async function withdraw(
	amount: number,
	currency: TerraCurrency
): Promise<TxReceipt> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	return await terraUtils.postTransaction({
		contractAddress: marketplaceContractAddress,
		message: {
			withdraw_balance: {
				denom: getDenomForCurrency(currency),
				amount: amountConverter.userFacingToBlockchainValue(amount),
			},
		},
		coins: {
			ust: UST_WITHDRAW_FEE,
		},
	})
}

async function getBalance(address: string): Promise<Balance> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	const response = await terraUtils.sendQuery(marketplaceContractAddress, {
		balance: {
			address,
		},
	})

	const balances = _.keyBy(response.balance, 'denom')

	return {
		UST: amountConverter.blockchainValueToUserFacing(
			balances.uusd?.amount || '0'
		),
		LUNA: amountConverter.blockchainValueToUserFacing(
			balances.uluna?.amount || '0'
		),
	}
}

async function getWithdrawableBalance(): Promise<Balance> {
	const userAddress = await terraUtils.getWalletAddress()
	return await getBalance(userAddress)
}

async function postBid(bidRequest: BidRequest): Promise<TxReceipt> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	return await terraUtils.postTransaction({
		contractAddress: marketplaceContractAddress,
		message: {
			post_buy_order: {
				order_id: generateRandomOrderId('buy'),
				nft_contract_address: bidRequest.nftContractAddress,
				token_id: bidRequest.tokenId,
				price: amountConverter.userFacingToBlockchainValue(bidRequest.amount!),
				denom: getDenomForCurrency(bidRequest.currency!),
				expiration: getLongExpiration(),
			},
		},
		coins: LUART_STABLECOIN_FEE_FOR_BID,
	})
}

async function getOrderDetails(orderId: string) {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	return await terraUtils.sendQuery(marketplaceContractAddress, {
		order_details: {
			order_id: orderId,
		},
	})
}

async function executeBid(bidOrderId: string): Promise<TxReceipt> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	// Get bid order details
	const orderDetails = await getOrderDetails(bidOrderId)
	const nftContractAddress = orderDetails.order_details.nft_contract_address
	const tokenId = orderDetails.order_details.token_id

	// Get latest sell order
	const sellOrder = await getSellOrderForToken(nftContractAddress, tokenId)

	const txs = [
		// Cancel sell order
		{
			contractAddress: marketplaceContractAddress,
			message: {
				cancel_order: {
					order_id: sellOrder.order_id,
				},
			},
		},

		// Approve NFT spending by marketplace contract
		{
			contractAddress: nftContractAddress,
			message: {
				approve: {
					spender: marketplaceContractAddress,
					token_id: tokenId,
				},
			},
		},

		// Execute buy order
		{
			contractAddress: marketplaceContractAddress,
			message: {
				execute_order: {
					order_id: bidOrderId,
				},
			},
		},
	]

	// Send transaction
	return await terraUtils.postManyTransactions(txs)
}

async function depositTokensOnMarketplace(
	amountUserFacing: number,
	currency: TerraCurrency
): Promise<TxReceipt> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	const amount = amountConverter.userFacingToBlockchainValue(amountUserFacing)
	const denom = getDenomForCurrency(currency)

	return await terraUtils.postTransaction({
		contractAddress: marketplaceContractAddress,
		message: {
			add_balance: {
				denom,
				amount,
			},
		},
		coins: {
			[{ uusd: 'ust', uluna: 'luna' }[denom]]: amount,
		},
	})
}

async function cancelBid(bidOrderId: string): Promise<TxReceipt> {
	const marketplaceContractAddress = await addresses.getContractAddress(
		'marketplace'
	)

	return await terraUtils.postTransaction({
		contractAddress: marketplaceContractAddress,
		message: {
			cancel_order: {
				order_id: bidOrderId,
			},
		},
	})
}

async function getAllBidsForUser(address: string): Promise<Bid[]> {
	const allOrdersForUser = await getAllOrdersForUser(undefined)

	const allBids = []
	for (const order of allOrdersForUser) {
		const isActive = order.status === 'active'
		if (order.order_type == ORDER_TYPES.BUY && isActive) {
			// TODO: maybe we show also show inactive orders
			const nftContractAddress = order.order_details.nft_contract_address
			const tokenId = order.order_details.token_id

			const tokenDetails = await getTokenDetails(nftContractAddress, tokenId)

			const collection = await luartCdn.getRegisteredCollection(nftContractAddress)

			allBids.push({
				creatorAddress: address,
				isActive: order.status == 'active',
				bidOrderId: order.order_id,
				timestamp: order.order_details.timestamp * 1000,
				tokenDetails: {
					...tokenDetails,
					collectionTitle: tokenDetails.collectionTitle!,
					isExclusive: Boolean(collection.isExclusive),
					isVideo: Boolean(collection.isVideo),
				},
				nftContractAddress,
				tokenId,
				amount: amountConverter.blockchainValueToUserFacing(
					order.order_details.price
				),
				currency: getCurrencyForDenom(order.order_details.denom),
			})
		}
	}

	return allBids
}

async function getBalanceForSeveralAddresses(
	addresses: string[]
): Promise<{ [address: string]: Balance }> {
	const uniqueAddresses = _.uniq(addresses)

	const resultBalances: { [address: string]: Balance } = {}

	const promises = uniqueAddresses.map(async (address: string) => {
		const balance = await getBalance(address)
		resultBalances[address] = balance
	})

	// Wait for fetching all balances
	await Promise.all(promises)

	return resultBalances
}

async function getAllBidsForToken(
	nftContractAddress: string,
	tokenId: string
): Promise<Bid[]> {
	const activeOrders = await getActiveOrdersForToken(nftContractAddress, tokenId)

	const tokenDetails = await getTokenDetails(nftContractAddress, tokenId)

	// TODO: remove console.log
	// console.log({ activeOrders });

	const orderCreators = activeOrders.map(o => o.order_creator)
	const orderCreatorsBalances = await getBalanceForSeveralAddresses(
		orderCreators
	)

	const allBidsForToken = []
	for (const order of activeOrders) {
		if (order.order_type === ORDER_TYPES.BUY) {
			const currency = getCurrencyForDenom(order.order_details.denom)
			const amount = amountConverter.blockchainValueToUserFacing(
				order.order_details.price
			)
			const creatorAddress = order.order_creator
			const creatorBalance = orderCreatorsBalances[creatorAddress][currency]
			const isSufficientBalance = !!creatorBalance && creatorBalance >= amount

			// TODO: remove comment
			// console.log({isSufficientBalance, creatorBalance, amount, currency});

			// break;
			allBidsForToken.push({
				creatorAddress,
				isActive: order.status == 'active' && isSufficientBalance,
				bidOrderId: order.order_id,
				timestamp: order.order_details.timestamp * 1000,
				tokenDetails: {
					...tokenDetails,
					collectionTitle: tokenDetails.collectionTitle!,
					isExclusive: false, // TODO: solve it better
				},
				nftContractAddress,
				tokenId,
				amount,
				currency,
			})
		}
	}

	return allBidsForToken.filter(b => b.isActive)
}

function prepareSortParamForMarketplaceSmartContract(
	sort: TokenSortType
): string {
	const mapping = {
		LISTING_NEWEST: 'listing_time_newest',
		LISTING_OLDEST: 'listing_time_oldest',
		PRICE_HIGHEST: 'price_highest',
		// PRICE_LOWEST: 'price_lowest',
		PRICE_LOWEST: 'listing_time_newest', // This is a hack, that is needed to fix sorting by lowest
	}
	return mapping[sort]
}

function getDenomForCurrency(currency: TerraCurrency) {
	if (currency == 'LUNA') {
		return 'uluna'
	}
	if (currency == 'UST') {
		return 'uusd'
	}
	throw new Error(`Unsupported currency: ${currency}`)
}

function getCurrencyForDenom(denom: 'uusd' | 'uluna'): TerraCurrency {
	if (denom == 'uusd') {
		return 'UST'
	}
	if (denom == 'uluna') {
		return 'LUNA'
	}
	throw new Error(`Unsupported denom: ${denom}`)
}

function getLongExpiration() {
	return Math.round(Date.now() / 1000) + 100 * 365 * 24 * 3600 // 100 years after
}

export default {
	getTokensOnSellForUser,
	offerSellPrice,
	buyNow,
	getTokenTradingDetailsForUser,
	cancelSelling,
	getListedTokens,
	getWithdrawableBalance,
	withdraw,

	// Bidding functions
	postBid,
	cancelBid,
	executeBid,
	depositTokensOnMarketplace,
	getAllBidsForUser,
	getAllBidsForToken,
}
