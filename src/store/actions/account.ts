import blockchain from 'utils/blockchain/blockchain'
import { Dispatch } from 'redux'
import { AccountAction, AccountActionTypes } from '../types/account.types'
import { NFTTokenDetails } from 'utils/blockchain/blockchain.interface'

/**
 * @deprecated There is no marketplace balance any more (bids are escrowed when
 * placed); this always stores { LUNA: 0, UST: 0 }.
 */
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
			const counts: { [key: string]: number } = {}

			// One unreachable collection shouldn't hide the others.
			await Promise.allSettled(
				nftContractAddresses.map(nftContractAddress =>
					blockchain
						.getTokensOwnedByUserCountInCollection(nftContractAddress)
						.then((count: number) => {
							if (count > 0) {
								counts[nftContractAddress] = count
							}
						})
				)
			)

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

/** Wallet balance. Only LUNA exists on Terra 2; `ust` and `luart` stay 0 for old UI code. */
export const getBalance = () => async (dispatch: Dispatch<AccountAction>) => {
	try {
		const luna = await blockchain.getBalanceLUNA()

		dispatch({
			type: AccountActionTypes.GET_BALANCE,
			payload: { ust: 0, luna, luart: 0 },
		})
	} catch (error) {
		console.log(error)
	}
}
