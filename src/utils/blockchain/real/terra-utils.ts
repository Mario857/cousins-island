import {
	LCDClient,
	MsgExecuteContract,
	Coins,
	Coin,
	Msg,
	ExtensionOptions,
} from '@terra-money/terra.js'
import { Wallet } from '@terra-money/wallet-provider'
import { TxReceipt } from '../blockchain.interface'
import axios from 'axios'
import { sleep } from '../mock/utils'
import _ from 'lodash'
import addresses from './addresses'

export const UST_DECIMALS = 6
export const LUART_DECIMALS = 6
export const LP_DECIMALS = 6
export const LUNA_DECIMALS = 6

let __cachedGasPrices__: object // Used for lazy gas prices fetching

type NetworkId = 'pisco-1' | 'phoenix-1'

interface CoinsDetails {
	ust?: string
	luna?: string
}

interface TransactionDetails {
	contractAddress: string
	message: object
	coins?: CoinsDetails
}

const LCD_URLS = {
	'pisco-1': 'https://pisco-lcd.terra.dev',
	'phoenix-1': 'https://phoenix-lcd.terra.dev',
}

const FCD_URLS = {
	'pisco-1': 'https://pisco-fcd.terra.dev',
	'phoenix-1': 'https://phoenix-fcd.terra.dev',
}

export const amountConverter = {
	luart: createAmountConverter(LUART_DECIMALS),
	ust: createAmountConverter(UST_DECIMALS),
	lp: createAmountConverter(LP_DECIMALS),
	luna: createAmountConverter(LUNA_DECIMALS),
}

let wallet: Wallet
let waitedForWallet = false

function setWallet(newWallet: Wallet) {
	// console.log(`Setting a new wallet in blockchain.ts module`, { newWallet });
	wallet = newWallet
}

async function getLCDClient(gasPrices?: any) {
	const url = await getLcdURL()
	const networkId = getNetworkId()
	return new LCDClient({
		URL: url,
		chainID: networkId,
		gasPrices,
	})
}

async function getLcdURL(): Promise<string> {
	const networkId = getNetworkId()
	return LCD_URLS[networkId]
}

function getNetworkId(): NetworkId {
	checkTerraNetworkParamInURL()

	if (localStorage.selectedNetworkId) {
		return localStorage.selectedNetworkId
	} else if (wallet) {
		return wallet.network.chainID as NetworkId
	} else {
		return 'phoenix-1'
	}

	// Old approach commented below
	// We decided to enable switching to testnet
	// Only using ?use-testnet param in URL
	// Becase the way with active waiting slowed
	// down the loading time for majority of users
	// that wanted to use the app on mainnet

	// // Waiting for wallet (max: 2 seconds)
	// const maxTries = 2,
	//   retryIntervalMilliseconds = 200,
	//   throwErrorIfNoWallet = false;
	// await getWalletAddress(
	//   maxTries,
	//   retryIntervalMilliseconds,
	//   throwErrorIfNoWallet
	// ); // max duration: 2 seconds
}

async function isTestnet(): Promise<boolean> {
	const networkId = getNetworkId()
	return networkId === 'pisco-1'
}

function checkTerraNetworkParamInURL(): void {
	const url = window.location.href
	if (url.includes('use-testnet')) {
		localStorage.selectedNetworkId = 'pisco-1'
	}
	if (url.includes('use-mainnet')) {
		localStorage.selectedNetworkId = 'phoenix-1'
	}
	if (url.includes('clear-network-selection')) {
		localStorage.removeItem('selectedNetworkId')
	}
}

async function lazyFetchGasPrices() {
	const networkId = getNetworkId()

	if (!__cachedGasPrices__) {
		const response = await axios.get(FCD_URLS[networkId] + '/v1/txs/gas_prices')
		__cachedGasPrices__ = _.pick(response.data, ['uluna'])
	}

	return __cachedGasPrices__
}

async function getWalletAddress(
	maxTries: number = 3,
	retryIntervalMilliseconds: number = 1000,
	throwErrorIfNoWallet: boolean = true
): Promise<string> {
	for (let i = 0; i < maxTries; i++) {
		const address = wallet?.wallets[0]?.terraAddress
		if (address) {
			return address
		} else {
			console.log(
				`Haven't got wallet address. Retrying in ${retryIntervalMilliseconds} ms`
			)
			await sleep(retryIntervalMilliseconds)
		}
	}

	if (throwErrorIfNoWallet) {
		throw new Error('Unable to get wallet address')
	} else {
		return ''
	}
}

// Returns UST balance on the user's wallet
export async function getBalanceUST(): Promise<number> {
	const address = await getWalletAddress()
	const fcdUrl = await getLcdURL()
	const response = await axios.get(`${fcdUrl}/bank/balances/${address}`)

	for (const coin of response.data.result) {
		if (coin.denom === 'uusd') {
			return amountConverter.ust.blockchainValueToUserFacing(coin.amount)
		}
	}

	// If uusd not found in the coin list, return 0
	return 0
}

export async function getBalanceLUNA(): Promise<number> {
	const address = await getWalletAddress()
	const fcdUrl = await getLcdURL()
	const response = await axios.get(`${fcdUrl}/bank/balances/${address}`)

	for (const coin of response.data.result) {
		if (coin.denom === 'uluna') {
			return amountConverter.luna.blockchainValueToUserFacing(coin.amount)
		}
	}

	return 0
}

async function sendQuery(contractAddress: string, query: object): Promise<any> {
	const lcdClient = await getLCDClient()
	return await lcdClient.wasm.contractQuery(contractAddress, query)
}

async function postTransaction(tx: TransactionDetails): Promise<TxReceipt> {
	return postManyTransactions([tx])
}

async function estimateTxFee(messages: Msg[]) {
	const address = await getWalletAddress()

	const gasPrices = await lazyFetchGasPrices()

	const lcdClient = await getLCDClient(gasPrices)
	const memo = 'estimate fee'

	const accountInfo = await lcdClient.auth.accountInfo(address)

	const txOptions: ExtensionOptions = {
		msgs: messages,
		gasPrices: gasPrices as any,
		gasAdjustment: 1.2,
		feeDenoms: ['uluna'],
		memo,
	}

	return lcdClient.tx.estimateFee(
		[
			{
				sequenceNumber: accountInfo.getSequenceNumber(),
				publicKey: accountInfo.getPublicKey(),
			},
		],
		txOptions
	)
}

async function postManyTransactions(
	txs: TransactionDetails[]
): Promise<TxReceipt> {
	checkWallet('postManyTransactions')

	const address = await getWalletAddress()
	const msgs = txs.map(tx => {
		const coins = getCoinsConfig(tx.coins)
		return new MsgExecuteContract(address, tx.contractAddress, tx.message, coins)
	})

	const fee = await estimateTxFee(msgs)

	const tx = await wallet.post({
		fee,
		msgs,
	})
	const txId = tx.result.txhash

	const txTerraFinderUrl = await getTerraUrlForTxId(txId)

	// TODO: improve result fee fetching
	return {
		txId,
		txFee: '< 5UST',
		txTerraFinderUrl,
	}
}

// It turned out that limit must be one of [10, 100]
// Commented for now, because it is not used anywhere
// async function loadLatestTransactionsForUser(
//   address: string,
//   limit: number = 10
// ): Promise<any[]> {
//   const networkId = getNetworkId();
//   const fcdUrl = FCD_URLS[networkId] + '/v1/txs';

//   // Fetching data
//   const response = await axios.get(fcdUrl, {
//     params: {
//       offset: 0,
//       limit,
//       account: address,
//     },
//   });

//   return response.data.txs;
// }

async function getTxResult(txHash: string): Promise<any> {
	const networkId = getNetworkId()
	const response = await axios.get(`${FCD_URLS[networkId]}/v1/tx/${txHash}`)
	return response
}

// Checking is terra gateway working properly
async function pingTerraGateway(): Promise<any> {
	const networkId = getNetworkId()
	const response = await axios.get(`${FCD_URLS[networkId]}/syncing`)
	return response
}

async function getTxs(offset: number, limit: number) {
	const networkId = getNetworkId()
	const account = await addresses.getContractAddress('marketplace')

	const response = await axios.get(`${FCD_URLS[networkId]}/v1/txs`, {
		params: {
			account,
			offset,
			limit,
		},
	})

	return { ...response.data }
}

function getCoinsConfig(coins?: CoinsDetails): Coins.Input | undefined {
	if (coins) {
		const coinObjects = []
		if (coins.luna) {
			const lunaCoin = Coin.fromData({ denom: 'uluna', amount: coins.luna })
			coinObjects.push(lunaCoin)
		}
		if (coins.ust) {
			const utsCoin = Coin.fromData({ denom: 'uusd', amount: coins.ust })
			coinObjects.push(utsCoin)
		}
		return new Coins(coinObjects)
	} else {
		return undefined
	}
}

function checkWallet(parentFunctionName: string): void {
	if (!wallet) {
		throw new Error(`${parentFunctionName} function requires connected wallet`)
	}
}

async function getTerraUrlForTxId(txId: string): Promise<string> {
	const networkId = getNetworkId()

	return `https://finder.terra.money/${networkId}/tx/${txId}`
}

function createAmountConverter(decimals: number) {
	return {
		userFacingToBlockchainValue: (amount: number) =>
			String(Math.floor(amount * 10 ** decimals)),
		blockchainValueToUserFacing: (amount: any) => Number(amount) / 10 ** decimals,
	}
}

// MintDAO/RoboHero wants to format their dynamic trait to e.g. 2.5 $MINT
function formatBlockchainValueToCurrencyAmount(
	value: number,
	currency: string,
	decimals = 6
) {
	const amountConverter = createAmountConverter(decimals)

	const fixed = Math.pow(10, 2)

	return `${
		Math.floor(amountConverter.blockchainValueToUserFacing(value) * fixed) / fixed
	} ${currency}`
}

function formatBlockchainValueToPercentageValue(value: number) {
	const percentageValue = value / 10000

	return `${percentageValue > 100 ? 100 : percentageValue}%`
}

export default {
	sendQuery,
	postTransaction,
	postManyTransactions,
	getNetworkId,
	isTestnet,
	getWalletAddress,
	setWallet,
	getBalanceUST,
	getBalanceLUNA,
	amountConverter,
	getTxResult,
	pingTerraGateway,
	getTxs,
	getTerraUrlForTxId,
	formatBlockchainValueToCurrencyAmount,
	formatBlockchainValueToPercentageValue,
}
