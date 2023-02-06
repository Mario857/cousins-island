import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import Tokens from './components/Tokens/Tokens'
import Grid from '@mui/material/Grid'
import CollectionsSidebar from './components/CollectionsSidebar/CollectionsSidebar'
import { useEffect, useState } from 'react'
import { getOwnedTokens } from 'store/actions/account'
import { NFTTokenDetails } from 'utils/blockchain/blockchain.interface'
import blockchain from 'utils/blockchain/blockchain'
import AccountLoader from './components/AccountLoader/AccountLoader'
import { getOwnedTokensCount } from 'store/actions/account'

const LIMIT = 30

const AccountOwnedPage = () => {
	const { ownedTokens, ownedTokensCount, accountLoaders } = useSelector(
		(state: State) => state.account
	)
	const { collections } = useSelector((state: State) => state.collections)

	const dispatch = useDispatch()

	const [selectedNftContractAddress, setSelectedNftContractAddress] = useState<
		string | null
	>(null)

	const [loadedTokens, setLoadedTokens] = useState<null | NFTTokenDetails[]>(
		null
	)

	const [loadingMore, setLoadingMore] = useState(false)
	const [canLoadMore, setCanLoadMore] = useState(false)
	const [alreadyLoadedMore, setAlreadyLoadedMore] = useState(false)

	useEffect(() => {
		if (!selectedNftContractAddress && ownedTokensCount && collections) {
			setSelectedNftContractAddress(
				Object.keys(ownedTokensCount)[0] || collections[0].nftContractAddress
			)
		}
		if (selectedNftContractAddress) {
			if (
				!ownedTokens ||
				(ownedTokens && !ownedTokens[selectedNftContractAddress])
			) {
				dispatch(getOwnedTokens(selectedNftContractAddress) as any)
			}
		}
	}, [dispatch, selectedNftContractAddress, ownedTokensCount, collections])

	useEffect(() => {
		if (selectedNftContractAddress) {
			const selectedOwnedTokens = ownedTokens?.[selectedNftContractAddress]
			if (selectedOwnedTokens) {
				setLoadedTokens(selectedOwnedTokens)
				setCanLoadMore(selectedOwnedTokens.length >= LIMIT)
			}
		}
	}, [ownedTokens, selectedNftContractAddress])

	useEffect(() => {
		if (collections && !ownedTokensCount) {
			const nftContractAddresses = collections.map(
				collection => collection.nftContractAddress
			)
			dispatch(getOwnedTokensCount(nftContractAddresses) as any)
		}
	}, [dispatch, collections])

	const getMoreTokens = async () => {
		setLoadingMore(true)
		try {
			if (selectedNftContractAddress && loadedTokens && loadedTokens.length > 0) {
				const lastLoadedToken = loadedTokens[loadedTokens.length - 1]
				const newLoadedTokens =
					await blockchain.getTokensOnWalletForUserInCollection(
						selectedNftContractAddress,
						lastLoadedToken.tokenId
					)

				if (newLoadedTokens && newLoadedTokens.length > 0) {
					setLoadedTokens(prevLoadedTokens => {
						if (prevLoadedTokens) {
							return [...prevLoadedTokens, ...newLoadedTokens]
						}

						return newLoadedTokens
					})

					if (newLoadedTokens.length <= LIMIT - 1) {
						setCanLoadMore(false)
					}
				} else {
					setCanLoadMore(false)
				}
			}
		} catch (error) {
			console.log(error)
			setCanLoadMore(false)
		}

		setAlreadyLoadedMore(true)
		setLoadingMore(false)
	}

	return !accountLoaders?.getOwnedTokensCount ? (
		<Grid container spacing={4}>
			<Grid item xs={12} md={3}>
				<CollectionsSidebar
					collections={collections}
					tokensCount={ownedTokensCount}
					setSelectedNftContractAddress={setSelectedNftContractAddress}
					selectedNftContractAddress={selectedNftContractAddress}
				/>
			</Grid>
			<Grid item xs={12} md={9}>
				<Tokens
					tokens={loadedTokens}
					loading={accountLoaders?.getOwnedTokens || !selectedNftContractAddress}
					getMoreTokens={getMoreTokens}
					canLoadMore={canLoadMore}
					loadingMore={loadingMore}
					alreadyLoadedMore={alreadyLoadedMore}
				/>
			</Grid>
		</Grid>
	) : (
		<AccountLoader />
	)
}

export default AccountOwnedPage
