import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Transaction from '../Transaction/Transaction'
import Stack from '@mui/material/Stack'
import blockchain from 'utils/blockchain/blockchain'
import {
	LatestTransactionsQuery,
	LatestTransactionsType,
} from 'utils/blockchain/blockchain.interface'
import Box from '@mui/material/Box'
import Button from 'components/Button/Button'
import Typography from '@mui/material/Typography'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import FiltersMobile from '../FiltersMobile/FiltersMobile'
import { BoltIcon, FlameIcon, ShoppingBagIcon } from 'theme/icons'
import { useMediaQuery } from 'react-responsive'
import Filters from '../Filters/Filters'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import NotFound from 'components/NotFound/NotFound'
import InfiniteScroll from 'react-infinite-scroll-component'
import Alert from 'components/Alert/Alert'

declare const window: any

export interface FiltersComponentProps {
	selectedType: string
	selectedContractAddress: string
	handleSelectType: (newSelectType: string) => void
	handleContractAddressUpdate: (newContractAddress?: string) => void
	types: {
		label: string
		value: string
		icon?: JSX.Element
	}[]
	resetFilters: () => void
	setSelectedContractAddress?: React.Dispatch<React.SetStateAction<string>>
	setSelectedType?: React.Dispatch<React.SetStateAction<string>>
	loading?: boolean
}

interface TransactionsProps {
	userTransactions?: boolean
}

const Activity: React.FC<TransactionsProps> = ({
	userTransactions = false,
}) => {
	const [transactions, setTransactions] = useState<any>(null)
	const [offset, setOffset] = useState(0)
	const [loading, setLoading] = useState({
		getTransactions: true,
		fetchMoreTransactions: false,
	})
	const [canLoadMore, setCanLoadMore] = useState(true)
	const [error, setError] = useState(false)

	const isMobile = useMediaQuery({ maxWidth: 991 })

	const location = useLocation()
	const history = useHistory()

	const parsedQuery = queryString.parse(location.search)

	const [selectedType, setSelectedType] = useState(
		(parsedQuery.eventType as string) || 'all'
	)
	const [selectedContractAddress, setSelectedContractAddress] = useState<any>(
		parsedQuery.nftContractAddress || 'all'
	)

	const query: LatestTransactionsQuery = {
		limit: 20,
		offset: 0,
		type: [],
	}

	const replaceURLWithQuery = (
		nftContractAddress: string,
		eventType: string
	) => {
		let queryToURL: {
			[key: string]: string
		} = {}

		if (nftContractAddress !== 'all')
			queryToURL.nftContractAddress = nftContractAddress

		if (eventType !== 'all') queryToURL.eventType = eventType

		history.replace({
			pathname: location.pathname,
			search: queryString.stringify(queryToURL),
		})
	}

	const handleSelectType = (newSelectedType: string) => {
		if (newSelectedType === selectedType) return

		setSelectedType(newSelectedType)
		setOffset(0)
		setTransactions(null)

		replaceURLWithQuery(selectedContractAddress, newSelectedType)
	}

	const handleContractAddressUpdate = (newContractAddress?: string) => {
		setSelectedContractAddress(newContractAddress)
		setOffset(0)
		setTransactions(null)

		if (newContractAddress) replaceURLWithQuery(newContractAddress, selectedType)
	}

	const getLatestTransactions = async () => {
		if (transactions) {
			setLoading(loading => ({ ...loading, fetchMoreTransactions: true }))
		} else {
			setLoading(loading => ({ ...loading, getTransactions: true }))
		}

		const types = (
			selectedType === 'all'
				? [
						'marketplace_execute_order',
						'marketplace_post_sell_order',
						'marketplace_post_buy_order',
				  ]
				: [selectedType]
		) as LatestTransactionsType[]

		try {
			const params = {
				...query,
				type: types,
				offset,
				nftContractAddress:
					selectedContractAddress === 'all' ? undefined : selectedContractAddress,
			}

			const { latestTransactions, currentOffset } = !userTransactions
				? await blockchain.getLatestTransactions(params)
				: await blockchain.getTransactionsForUser(params)

			if (latestTransactions && latestTransactions.length < query.limit) {
				setCanLoadMore(false)
			}

			setTransactions((transactions: any) =>
				transactions ? [...transactions, ...latestTransactions] : latestTransactions
			)
			setOffset(currentOffset)
		} catch (error) {
			console.log(error)
			setTransactions(null)
			setError(true)
		}

		setLoading({ getTransactions: false, fetchMoreTransactions: false })
	}

	const wallet = useWallet()

	useEffect(() => {
		if (!transactions && !userTransactions) getLatestTransactions()
	}, [
		offset,
		transactions,
		selectedType,
		selectedContractAddress,
		userTransactions,
	])

	useEffect(() => {
		if (
			!transactions &&
			userTransactions &&
			wallet.status === WalletStatus.WALLET_CONNECTED
		)
			getLatestTransactions()
	}, [
		offset,
		transactions,
		selectedType,
		selectedContractAddress,
		wallet,
		userTransactions,
	])

	useEffect(() => {
		if (isMobile) {
			window.Intercom('update', {
				hide_default_launcher: true,
			})
		}

		return () => {
			window.Intercom('update', {
				hide_default_launcher: false,
			})
		}
	}, [])

	const types = [
		{
			label: 'All',
			value: 'all',
		},
		{
			label: 'Purchase',
			value: 'marketplace_execute_order',
			icon: <ShoppingBagIcon fontSize='small' />,
		},
		{
			label: 'Listing',
			value: 'marketplace_post_sell_order',
			icon: <BoltIcon fontSize='small' />,
		},
		{
			label: 'Bid',
			value: 'marketplace_post_buy_order',
			icon: <FlameIcon fontSize='small' />,
		},
		// {
		//   label: 'Cancellation',
		//   value: 'marketplace_cancel_order',
		//   icon: <ExchangeIcon />, // TODO: Ask Barry for icon
		// },
	]

	const resetFilters = () => {
		handleSelectType('all')
		handleContractAddressUpdate('all')

		history.replace({
			pathname: location.pathname,
			search: '',
		})
	}

	const filtersComponentProps = {
		selectedType,
		selectedContractAddress,
		handleSelectType,
		handleContractAddressUpdate,
		types,
		resetFilters,
	}

	return (
		<Grid container columnSpacing={4}>
			<Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
				{loading.getTransactions ? (
					<Box display='flex' justifyContent='center' mt={{ xs: 16, md: 24 }}>
						<LoadingSpinner size='large' color='secondary' />
					</Box>
				) : (
					<>
						{transactions && transactions.length > 0 ? (
							<InfiniteScroll
								dataLength={transactions.length}
								next={() => getLatestTransactions()}
								hasMore={canLoadMore}
								loader={
									<Box display='flex' justifyContent='center' width='100%' mt={4}>
										<LoadingSpinner size='large' color='secondary' />
									</Box>
								}
								endMessage={
									<Typography
										variant='body3'
										color='text.primary'
										textAlign='center'
										component='p'
										mt={4}
										sx={{ width: '100%' }}
									>
										That's all!
									</Typography>
								}
								scrollThreshold={0.9}
								style={{ overflowY: 'hidden' }}
							>
								<Stack spacing={3}>
									{transactions.map((transaction: any, index: number) => (
										<Transaction
											key={`activity-transaction-${index}`}
											transaction={transaction}
										/>
									))}
								</Stack>
							</InfiniteScroll>
						) : (
							<>
								{error ? (
									<Alert
										severity='error'
										title='Something went wrong'
										description="We're sorry! We're having a problem loading the data. Please try again later!"
									/>
								) : (
									<NotFound
										heading={userTransactions ? 'No activity history' : undefined}
										description={
											userTransactions
												? 'You will see activity history after you make a transaction in the marketplace'
												: undefined
										}
										mt={3}
									/>
								)}
							</>
						)}
					</>
				)}
			</Grid>
			<Grid
				item
				xs={12}
				md={4}
				order={{ xs: 1, md: 2 }}
				style={{ position: 'relative' }}
			>
				{isMobile ? (
					<FiltersMobile
						setSelectedContractAddress={setSelectedContractAddress}
						loading={loading.getTransactions || loading.fetchMoreTransactions}
						setSelectedType={setSelectedType}
						{...filtersComponentProps}
					/>
				) : (
					<Filters {...filtersComponentProps} />
				)}
			</Grid>
		</Grid>
	)
}

export default Activity
