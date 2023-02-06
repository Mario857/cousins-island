import blockchain from 'utils/blockchain/blockchain'
import {
	NFTCollectionDetails,
	TokensQuery,
} from 'utils/blockchain/blockchain.interface'
import React from 'react'
import { Dispatch } from 'redux'
import {
	CollectionsAction,
	CollectionsActionTypes,
} from '../types/collections.types'

export const getCollections =
	() => async (dispatch: Dispatch<CollectionsAction>) => {
		const loadingName = 'getCollections'

		dispatch({
			type: CollectionsActionTypes.COLLETIONS_LOADING,
			payload: loadingName,
		})

		try {
			const collections = await blockchain.getNFTCollections()
			const volumes = await blockchain.getCollectionsVolumes()

			const collectionsWithVolume = collections.map((collection: any) => ({
				...collection,
				volume: volumes[collection.nftContractAddress],
			}))

			const newestCollections = getNewestCollections(collectionsWithVolume)

			const oldestCollections = [...newestCollections].reverse()

			const trendingCollections = getTrendingCollections(collectionsWithVolume)

			const collectionsSortedAlphabetically = getCollectionsSortedAlphabetically(
				collectionsWithVolume
			)

			dispatch({
				type: CollectionsActionTypes.GET_COLLECTIONS,
				payload: {
					collections: collectionsSortedAlphabetically,
					oldestCollections,
					newestCollections,
					trendingCollections,
				},
			})
		} catch (error) {
			console.log(error)
			dispatch({
				type: CollectionsActionTypes.COLLECTIONS_ERROR,
				payload: loadingName,
			})
		}
	}

export const getCollection =
	(
		query: TokensQuery,
		queryChanged: boolean,
		setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
		loadingName: string
	) =>
	async (dispatch: Dispatch<CollectionsAction>) => {
		try {
			const promises = []

			let data: any = {}

			if (!queryChanged) {
				promises.push(
					await blockchain
						.getNFTCollection(query.nftContractAddress)
						.then((details: any) => (data.details = details))
				)
			}

			promises.push(
				await blockchain.getTokensInCollection(query).then(
					(tokens: any) =>
						(data.tokens = {
							pagesCount: tokens.pagesCount,
							data: tokens.tokens,
							totalResults: tokens.totalResults,
						})
				)
			)

			await Promise.all(promises)

			setLoading(prevLoading => ({ ...prevLoading, [loadingName]: false }))

			dispatch({
				type: CollectionsActionTypes.GET_COLLECTION,
				payload: data,
			})
		} catch (error) {
			console.log(error)
			setLoading(prevLoading => ({ ...prevLoading, [loadingName]: false }))
		}
	}

const getNewestCollections = (
	collections: NFTCollectionDetails[],
	maxCount = 999
) => {
	const sortedCollectionsByListingTime = collections.sort(
		(a, b) => b.marketplaceListingStart - a.marketplaceListingStart
	)

	const currentTimestamp = Date.now()

	const activeCollections = sortedCollectionsByListingTime.filter(
		collection => collection.marketplaceListingStart <= currentTimestamp
	)

	return activeCollections.slice(0, maxCount)
}

const getTrendingCollections = (
	collections: NFTCollectionDetails[],
	maxCount = 999
) => {
	return collections
		.sort((a, b) => (b.volume?.uluna || 0) - (a.volume?.uluna || 0))
		.slice(0, maxCount)
}

const getCollectionsSortedAlphabetically = (
	collections: NFTCollectionDetails[]
) => {
	const collectionsSortedAlphabetically = collections.sort((a, b) => {
		if (a.title < b.title) return -1
		if (a.title > b.title) return 1
		return 0
	})

	return collectionsSortedAlphabetically
}
