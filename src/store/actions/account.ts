import blockchain from 'utils/blockchain/blockchain'
import { Dispatch } from 'redux'
import { AccountAction, AccountActionTypes } from '../types/account.types'
import { NFTTokenDetails } from 'utils/blockchain/blockchain.interface'

export const getDepositedBalance =
	() => async (dispatch: Dispatch<AccountAction>) => {
		const loadingName = 'getDepositedBalance'

		dispatch({
			type: AccountActionTypes.ACCOUNT_LOADING,
			payload: loadingName,
		})

		try {
			const depositedBalance = await blockchain.getWithdrawableBalance()
			dispatch({
				type: AccountActionTypes.GET_DEPOSITED_BALANCE,
				payload: depositedBalance,
			})
		} catch (error) {
			dispatch({
				type: AccountActionTypes.ACCOUNT_ERROR,
				payload: loadingName,
			})
		}
	}

export const removeBidFromUserBids = (bidOrderId: string) => {
	return {
		type: AccountActionTypes.REMOVE_BID,
		payload: bidOrderId,
	}
}

export const getAllBidsForUser =
	(userAddress: string) => async (dispatch: Dispatch<AccountAction>) => {
		const loadingName = 'getAllBidsForUser'

		dispatch({
			type: AccountActionTypes.ACCOUNT_LOADING,
			payload: loadingName,
		})

		try {
			const bids = await blockchain.getAllBidsForUser(userAddress)

			dispatch({
				type: AccountActionTypes.GET_BIDS,
				payload: bids,
			})
		} catch (error) {
			dispatch({
				type: AccountActionTypes.ACCOUNT_ERROR,
				payload: loadingName,
			})
		}
	}

export const getOwnedTokens =
	(nftContractAddress: string) => async (dispatch: Dispatch<AccountAction>) => {
		const loadingName = 'getOwnedTokens'

		dispatch({
			type: AccountActionTypes.ACCOUNT_LOADING,
			payload: loadingName,
		})

		try {
			const ownedTokens = await blockchain.getTokensOnWalletForUserInCollection(
				nftContractAddress
			)

			dispatch({
				type: AccountActionTypes.GET_OWNED_TOKENS,
				payload: {
					[nftContractAddress]: ownedTokens,
				},
			})
		} catch (error) {
			dispatch({
				type: AccountActionTypes.ACCOUNT_ERROR,
				payload: loadingName,
			})
		}
	}

export const getOwnedTokensCount =
	(nftContractAddresses: string[]) =>
	async (dispatch: Dispatch<AccountAction>) => {
		const loadingName = 'getOwnedTokensCount'

		dispatch({
			type: AccountActionTypes.ACCOUNT_LOADING,
			payload: loadingName,
		})

		try {
			const promises = []

			let counts: { [key: string]: number } = {}

			for (let i = 0; i < nftContractAddresses.length; i++) {
				const nftContractAddress = nftContractAddresses[i]
				promises.push(
					blockchain
						.getTokensOwnedByUserCountInCollection(nftContractAddress)
						.then((count: number) => {
							if (count > 0) {
								counts[nftContractAddress] = count
							}
						})
				)
			}

			await Promise.all(promises)

			dispatch({
				type: AccountActionTypes.GET_OWNED_TOKENS_COUNT,
				payload: counts,
			})
		} catch (error) {
			dispatch({
				type: AccountActionTypes.ACCOUNT_ERROR,
				payload: loadingName,
			})
		}
	}

export const updateOwnedTokens = (updatedOwnedTokens: {
	[key: string]: NFTTokenDetails[]
}) => {
	return {
		type: AccountActionTypes.GET_OWNED_TOKENS,
		payload: updatedOwnedTokens,
	}
}

export const getOnSaleTokens =
	() => async (dispatch: Dispatch<AccountAction>) => {
		const loadingName = 'getOnSaletokens'

		dispatch({
			type: AccountActionTypes.ACCOUNT_LOADING,
			payload: loadingName,
		})

		try {
			const onSaleTokens = await blockchain.getTokensOnSellForUser()

			dispatch({
				type: AccountActionTypes.GET_ON_SALE_TOKENS,
				payload: onSaleTokens,
			})
		} catch (error) {
			console.log(error)
			dispatch({
				type: AccountActionTypes.ACCOUNT_ERROR,
				payload: loadingName,
			})
		}
	}

export const updateOnSaleTokens = (updatedOnSaleTokens: NFTTokenDetails[]) => {
	return {
		type: AccountActionTypes.GET_ON_SALE_TOKENS,
		payload: updatedOnSaleTokens,
	}
}

export const getBalance = () => async (dispatch: Dispatch<AccountAction>) => {
	try {
		const promises = []
		const balance = {
			ust: 0,
			luna: 0,
			luart: 0,
		}

		promises.push(
			blockchain.getBalanceUST().then((ust: any) => (balance.ust = ust))
		)

		promises.push(
			blockchain.getBalanceLUNA().then((luna: any) => (balance.luna = luna))
		)

		promises.push(
			blockchain.getBalanceLUART().then((luart: any) => (balance.luart = luart))
		)

		await Promise.all(promises)

		dispatch({
			type: AccountActionTypes.GET_BALANCE,
			payload: balance,
		})
	} catch (error) {
		console.log(error)
	}
}
