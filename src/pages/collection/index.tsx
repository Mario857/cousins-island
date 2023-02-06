import Layout from 'components/Layout/Layout'
import Heading from 'components/Heading/Heading'
import * as ROUTES from 'constants/routes'
import Grid from '@mui/material/Grid'
import Filters from './components/Filters/Filters'
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import {
	NFTCollectionDetails,
	NFTTokenDetails,
	TokensQuery,
} from 'utils/blockchain/blockchain.interface'
import CollectionNFTs from './components/CollectionNFTs/CollectionNFTs'
import Sorting from './components/Sorting/Sorting'
import queryString from 'query-string'
import { parseFilterQuery } from 'utils/url-query'
import blockchainModule from 'utils/blockchain/blockchain'
import NotFound from 'components/NotFound/NotFound'
import ActiveFilters from './components/ActiveFilters/ActiveFilters'
import { debounce } from 'lodash'
import Box from '@mui/material/Box'
import { useMediaQuery } from 'react-responsive'
import Statistics from './components/Statistics/Statistics'
import isUserOnStageMarketplace from 'utils/isUserOnStageMarketplace'
import RelatedCollections from './components/RelatedCollections/RelatedCollections'
import ScrollUpButton from 'components/ScrollUpButton/ScrollUpButton'

const TOKENS_PER_PAGE = 21

export type TokensSortOptions = {
	label: string
	value: TokensQuery['sort']
}[]

const sortOptions: TokensSortOptions = [
	{
		label: 'Oldest Listed',
		value: 'LISTING_OLDEST',
	},
	{
		label: 'Newest Listed',
		value: 'LISTING_NEWEST',
	},
	{
		label: 'Lowest Price',
		value: 'PRICE_LOWEST',
	},
	{
		label: 'Highest Price',
		value: 'PRICE_HIGHEST',
	},
]

interface MatchParams {
	collectionAddress: string
}

const CollectionPage: React.FC<RouteComponentProps<MatchParams>> = props => {
	const nftContractAddress = props.match.params.collectionAddress
	const location = useLocation()
	const history = useHistory()

	const [tokensLoadedFirstTime, setTokensLoadedFirstTime] = useState(false)

	const isMobile = useMediaQuery({ maxWidth: 991 })

	const [tokens, setTokens] = useState<{
		tokens: NFTTokenDetails[]
		pagesCount: number
		totalResults: number
	} | null>(null)

	const [collection, setCollection] = useState<{
		details: NFTCollectionDetails
		traitFilters: any
	} | null>(null)

	const [loading, setLoading] = useState({
		getCollection: true,
		getTokens: false,
	})

	const [hasMore, setHasMore] = useState(false) // Can load more tokens

	const parsedQuery = queryString.parse(location.search)

	const initialQuery: TokensQuery = {
		nftContractAddress,
		page: 1,
		traitFilters: {},
		sort: sortOptions[1].value,
	}

	const [query, setQuery] = useState<TokensQuery>({
		nftContractAddress,
		page: initialQuery.page,
		traitFilters:
			parseFilterQuery('traitFilters', location.search) ||
			initialQuery.traitFilters,
		sort: parsedQuery?.sort || initialQuery.sort,
	})

	const getQueryToURL = (updatedQuery: TokensQuery) => {
		let queryToURL: any = {}

		if (updatedQuery.sort !== initialQuery.sort)
			queryToURL.sort = updatedQuery.sort
		if (updatedQuery.page !== initialQuery.page)
			queryToURL.page = updatedQuery.page
		if (updatedQuery.traitFilters !== initialQuery.traitFilters) {
			let traitFilters = {}

			const keys = Object.keys(updatedQuery.traitFilters)

			for (let i = 0; i < keys.length; i++) {
				traitFilters = {
					...traitFilters,
					[`traitFilters[${keys[i]}]`]: updatedQuery.traitFilters[keys[i]],
				}
			}

			queryToURL = { ...queryToURL, ...traitFilters }
		}

		return queryString.stringify(queryToURL)
	}

	const breadcrumbs = [
		{
			title: 'Homepage',
			href: ROUTES.HOME,
		},
		{
			title: 'Collections',
			href: ROUTES.COLLECTIONS,
		},
		{ title: collection?.details?.title || '' },
	]

	const getTokens = async (query: TokensQuery) => {
		try {
			const tokens = await blockchainModule.getTokensInCollection(query)
			setTokens(tokens)

			const queryToURL = getQueryToURL(query)

			if (tokens.tokens.length >= TOKENS_PER_PAGE) setHasMore(true)

			history.replace({
				pathname: location.pathname,
				search: queryToURL,
			})
		} catch (error) {
			console.log(error)
			setTokens(null)
		}

		if (!tokensLoadedFirstTime) setTokensLoadedFirstTime(true)

		setLoading(prevLoading => ({ ...prevLoading, getTokens: false }))
	}

	const fetchMoreTokens = async (query: TokensQuery) => {
		setLoading(prevLoading => ({ ...prevLoading, fetchMoreTokens: true }))

		try {
			const newTokens = await blockchainModule.getTokensInCollection({
				...query,
				page: query.page + 1,
			})

			setQuery({ ...query, page: query.page + 1 })

			if (newTokens.tokens.length < TOKENS_PER_PAGE) setHasMore(false)

			setTokens({
				tokens: [...tokens?.tokens!, ...newTokens.tokens],
				pagesCount: newTokens.pagesCount,
				totalResults: tokens?.totalResults! + newTokens.totalResults,
			})
		} catch (error) {
			console.log(error)
		}

		setLoading(prevLoading => ({ ...prevLoading, fetchMoreTokens: false }))
	}

	const getCollection = async () => {
		setLoading(prevLoading => ({ ...prevLoading, getCollection: true }))

		try {
			const collection = await blockchainModule.getNFTCollection(
				query.nftContractAddress
			)

			const possibleTraits = collection.possibleTraits

			const traitFilters = Object.keys(possibleTraits).map(key => {
				const trait = possibleTraits[key]

				const count = trait.length

				const sortedTraits = trait.sort((a: any, b: any) => b.rarity - a.rarity)

				return {
					name: key,
					title: `${key} (${count})`,
					traits: sortedTraits,
				}
			})

			let traitFiltersAfterSkip = traitFilters

			const traitsToSkip = [
				...(collection?.skipTraitsInFilters || []),
				...(collection?.listOfHiddenTraits || []),
			]

			if (traitsToSkip && traitsToSkip?.length > 0) {
				traitFiltersAfterSkip = traitFilters.filter(
					filter => !traitsToSkip?.find(skipTrait => skipTrait === filter.name)
				)
			}

			const showUpcomingProjects = isUserOnStageMarketplace

			if (
				collection.marketplaceListingStart <= Date.now() ||
				showUpcomingProjects
			) {
				setCollection({
					details: collection,
					traitFilters: traitFiltersAfterSkip,
				})
			}
		} catch (error) {
			console.log(error)
			setCollection(null)
		}

		setLoading(prevLoading => ({ ...prevLoading, getCollection: false }))
	}

	useEffect(() => {
		if (query.nftContractAddress !== nftContractAddress)
			setQuery({ ...initialQuery, nftContractAddress })

		if (!collection) getCollection()
	}, [nftContractAddress])

	const debounceGetTokens = debounce(getTokens, 2000)

	useEffect(() => {
		if (query) {
			setLoading(prevLoading => ({ ...prevLoading, getTokens: true }))

			if (!tokensLoadedFirstTime) {
				getTokens(query)
			} else {
				debounceGetTokens(query)
			}

			if (
				collection &&
				collection.details.nftContractAddress !== nftContractAddress
			)
				getCollection()
		}

		return () => {
			debounceGetTokens.cancel()
		}
	}, [query.nftContractAddress, query.sort, query.traitFilters])

	const handleFilterToggle = useCallback(
		(filterName: string, filterValue: string, isChecked: boolean) => {
			setQuery((query: any) => {
				const traitFilters = query.traitFilters
				let updatedTraitFilters = { ...traitFilters }

				if (isChecked && traitFilters[filterName]) {
					if (traitFilters[filterName].length == 1) {
						delete updatedTraitFilters[filterName]
					} else if (traitFilters[filterName].length > 1) {
						updatedTraitFilters = {
							...traitFilters,
							[filterName]: traitFilters[filterName].filter(
								(selectedFilterValue: any) => selectedFilterValue !== filterValue
							),
						}
					}
				} else {
					const newFilterValues = traitFilters[filterName]
						? [...traitFilters[filterName], filterValue]
						: [filterValue]

					const uniqueNewFiltersValues: string[] = Array.from(
						new Set(newFilterValues)
					)

					updatedTraitFilters = {
						...traitFilters,
						[filterName]: uniqueNewFiltersValues,
					}
				}

				const updatedQuery = {
					...query,
					page: 1,
					traitFilters: updatedTraitFilters,
				}

				if (!isMobile) window.scrollTo({ top: 0, behavior: 'smooth' })

				return updatedQuery
			})
		},
		[]
	)

	const clearFilters = () => {
		const updatedQuery = { ...query, page: 1, traitFilters: {} }
		const queryToURL = getQueryToURL(updatedQuery)

		history.replace({ pathname: location.pathname, search: queryToURL })

		if (!isMobile) window.scrollTo(0, 0)

		setQuery(updatedQuery)
	}

	return (
		<>
			<Layout
				breadcrumbs={collection ? breadcrumbs : undefined}
				loading={loading.getCollection}
			>
				{!collection && !loading.getCollection ? (
					<NotFound
						heading='Collection Not Found'
						description="Sorry, we've not been able to find the collection you are looking for. Please try again or explore other collections on our marketplace."
					/>
				) : (
					<>
						<Heading variant='h800' component='h1'>
							{collection?.details?.title}
						</Heading>
						<Grid
							container
							spacing={4}
							sx={{ mb: 3 }}
							direction='row'
							alignItems='center'
						>
							<Grid item xs={12} md={9}>
								{nftContractAddress && (
									<Statistics nftContractAddress={nftContractAddress} />
								)}
							</Grid>
							<Grid item xs={12} md={3}>
								<Sorting
									sortOptions={sortOptions}
									query={query}
									setQuery={setQuery}
									getQueryToURL={getQueryToURL}
								/>
							</Grid>
						</Grid>
						<Box sx={{ display: { xs: 'none', md: 'block' } }}>
							{collection && (
								<ActiveFilters
									query={query}
									possibleTraits={collection.details.possibleTraits}
									handleFilterToggle={handleFilterToggle}
									clearFilters={clearFilters}
									totalResults={tokens?.totalResults || undefined}
								/>
							)}
						</Box>
						<Grid container spacing={4}>
							<Grid item xs={12} md={3}>
								<Box
									sx={{
										position: { md: 'sticky' },
										top: { md: '32px' },
									}}
								>
									{collection &&
										collection?.details?.relatedCollections &&
										collection?.details?.relatedCollections?.length > 0 && (
											<RelatedCollections
												relatedCollections={collection?.details?.relatedCollections!}
											/>
										)}
									{collection?.traitFilters.length > 0 && (
										<Filters
											query={query}
											loading={loading.getTokens}
											traitFilters={collection?.traitFilters}
											handleFilterToggle={handleFilterToggle}
										/>
									)}
								</Box>
								<Box sx={{ display: { xs: 'block', md: 'none' } }}>
									{collection && (
										<ActiveFilters
											query={query}
											possibleTraits={collection.details.possibleTraits}
											handleFilterToggle={handleFilterToggle}
											clearFilters={clearFilters}
											totalResults={tokens?.totalResults || undefined}
										/>
									)}
								</Box>
							</Grid>
							<Grid item xs={12} md={9}>
								<CollectionNFTs
									collection={{
										details: collection?.details,
										tokens: {
											data: tokens?.tokens,
											pagesCount: tokens?.pagesCount,
										},
									}}
									query={query}
									setQuery={setQuery}
									loading={loading.getTokens}
									initialQuery={initialQuery}
									fetchMoreTokens={fetchMoreTokens}
									hasMore={hasMore}
								/>
							</Grid>
						</Grid>
					</>
				)}
			</Layout>
			<Box display={{ xs: 'block', md: 'none' }}>
				<ScrollUpButton />
			</Box>
		</>
	)
}

export default CollectionPage
