import axios from 'axios'
import terraUtils from './terra-utils'
import {
	NFTCollectionDetails,
	NFTTokenDetails,
	TraitValue,
} from '../blockchain.interface'
import registeredNftCollections from './registered-nft-collections'

// The CDN is heavily optimised with GZIP compression and efficient
const BASE_CDN_URL = 'https://cdn.cosin-island.io'
const COLLECTIONS_CACHE_KEY = 'COLLECTIONS_CACHE_KEY'

const __cache__: any = {}

export interface CollectionMetadata {
	[tokenId: string]: NFTTokenDetails
}

async function getDataUrl(): Promise<string> {
	const isTestnet = await terraUtils.isTestnet()
	const dataFolder = isTestnet ? 'testnet' : 'mainnet'
	return `${BASE_CDN_URL}/${dataFolder}`
}

async function getRegisteredCollection(
	nftContractAddress: string
): Promise<NFTCollectionDetails> {
	const collections = await getRegisteredCollections()

	const collection = collections.find(
		c => c.nftContractAddress == nftContractAddress
	)!

	const hideTraitsRarityFor = collection?.hideTraitsRarityFor

	// Hide traits rarity
	if (hideTraitsRarityFor && hideTraitsRarityFor?.length > 0) {
		for (const key of Object.keys(collection.possibleTraits)) {
			const traits = collection.possibleTraits[key]

			if (hideTraitsRarityFor.includes(key)) {
				collection.possibleTraits[key] = traits.map((trait: any) => ({
					...trait,
					rarity: 0,
				}))
			}
		}
	}

	return collection
}

async function getRegisteredCollections(): Promise<NFTCollectionDetails[]> {
	// We've changed the way of loading registered collections
	// Now the JSON file is stored right in the app code
	// // Lazy fetching

	// if (!__cache__[COLLECTIONS_CACHE_KEY]) {
	//   const registeredCollectionsUrl =
	//     (await getDataUrl()) + `/marketplace-registered-collections.json`;
	//   const response = await axios.get(registeredCollectionsUrl);
	//   __cache__[COLLECTIONS_CACHE_KEY] = response.data;
	// }

	// return __cache__[COLLECTIONS_CACHE_KEY];

	const chainId = terraUtils.getNetworkId()

	const collections = registeredNftCollections[
		chainId
	] as any as NFTCollectionDetails[]

	return collections
}

async function fetchCollectionMetadata(
	nftContractAddress: string
): Promise<CollectionMetadata> {
	// Lazy fetching
	if (!__cache__[nftContractAddress]) {
		const collectionMetadataUrl =
			(await getDataUrl()) + `/${nftContractAddress}/nft-compact-metadata.json`
		const response = await axios.get(collectionMetadataUrl)

		const collectionDetails = await getRegisteredCollection(nftContractAddress)

		const metadataWithRarity = addRarityToAndContractAddressToMetadata(
			response.data,
			nftContractAddress,
			collectionDetails.possibleTraits
		)

		const metadataWithCollectionTitle = await addCollectionTitleToMetadata(
			metadataWithRarity,
			collectionDetails
		)

		__cache__[nftContractAddress] = metadataWithCollectionTitle
	}

	return __cache__[nftContractAddress]
}

async function addCollectionTitleToMetadata(
	fetchedMetadata: any,
	collectionDetails: NFTCollectionDetails
) {
	let updatedMetadata = { ...fetchedMetadata }

	for (const tokenId of Object.keys(updatedMetadata)) {
		updatedMetadata[tokenId].collectionTitle = collectionDetails.title
	}

	return updatedMetadata
}

// Old approach - calculating rarity in browser
// function addRarityToAndContractAddressToMetadata(
//   fetchedMetadata: any,
//   nftContractAddress: string
// ): CollectionMetadata {
//   const rarityConfig: any = {};
//   let total = Object.keys(fetchedMetadata).length;

//   // Calculating rarity
//   for (const tokenId of Object.keys(fetchedMetadata)) {
//     for (const [traitName, traitValue] of Object.entries(
//       fetchedMetadata[tokenId].traits
//     )) {
//       if (!rarityConfig[traitName]) {
//         rarityConfig[traitName] = {};
//       }
//       if (!rarityConfig[traitName][traitValue as string]) {
//         rarityConfig[traitName][traitValue as string] = 0;
//       }
//       rarityConfig[traitName][traitValue as string]++;
//     }
//   }

//   // Preparing response object
//   const updatedMetadata = { ...fetchedMetadata };
//   for (const tokenId of Object.keys(updatedMetadata)) {
//     for (const traitName of Object.keys(updatedMetadata[tokenId].traits)) {
//       const value = updatedMetadata[tokenId].traits[traitName];
//       const rarity = toFixedIfNecessary(
//         (rarityConfig[traitName][value] / total) * 100,
//         2
//       ); // rarity percentage
//       updatedMetadata[tokenId].traits[traitName] = { value, rarity };
//       updatedMetadata[tokenId].nftContractAddress = nftContractAddress;
//     }
//   }

//   return updatedMetadata;
// }

// function toFixedIfNecessary(value: any, dp: number) {
//   return Number(parseFloat(value).toFixed(dp));
// }

// New approach - getting rarity from collection's possibleTraits property
function addRarityToAndContractAddressToMetadata(
	fetchedMetadata: any,
	nftContractAddress: string,
	possibleTraits: { [traitName: string]: TraitValue[] }
): CollectionMetadata {
	const updatedMetadata = { ...fetchedMetadata }

	for (const tokenId of Object.keys(updatedMetadata)) {
		updatedMetadata[tokenId].nftContractAddress = nftContractAddress
		const traits = updatedMetadata[tokenId].traits
		for (const [traitName, traitValue] of Object.entries(traits)) {
			const valWithRarity = possibleTraits[traitName]?.find(
				valWithRarity => valWithRarity.value === traitValue
			)
			updatedMetadata[tokenId].traits[traitName] = valWithRarity
		}
	}

	return updatedMetadata
}

export default {
	getRegisteredCollection,
	getRegisteredCollections,
	fetchCollectionMetadata,
}
