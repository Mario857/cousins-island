import { getNetwork, NetworkConfig } from 'config/networks'
import type {
	LatestTransactionDetails,
	LatestTransactionsQuery,
	LatestTransactionsResult,
	NFTTokenDetails,
} from '../blockchain.interface'
import { fromUluna } from './amounts'
import { getTokensDetails } from './collection-data'
import { activityParties, CursorBook, kindToType, typesToKinds } from './mapping'
import * as marketplace from './marketplace'
import type { Activity } from './types'
import { getWalletAddress } from './wallet-session'

// Marketplace history in the shape the activity pages and notifications use.

/**
 * The contract stores the block height but not the tx hash. Mainnet links to
 * the block on terra.valopers.com (verified URL pattern /blocks/<height>);
 * other networks link to the acting account.
 */
export function activityExplorerUrl(network: NetworkConfig, a: Pick<Activity, 'height' | 'actor'>): string {
	if (network.chainId === 'phoenix-1' && a.height > 0) return `https://terra.valopers.com/blocks/${a.height}`
	return network.explorerAddress(a.actor)
}

function placeholderToken(nftContractAddress: string, tokenId: string): NFTTokenDetails {
	return { tokenId, name: `#${tokenId}`, imageURL: '', nftContractAddress, traits: {} }
}

/** Activity entries -> LatestTransactionDetails, with token details loaded per collection. */
export async function toTransactionDetails(entries: Activity[]): Promise<LatestTransactionDetails[]> {
	const network = getNetwork()
	const idsByCollection = new Map<string, Set<string>>()
	for (const a of entries) {
		let ids = idsByCollection.get(a.collection)
		if (!ids) idsByCollection.set(a.collection, (ids = new Set()))
		ids.add(a.token_id)
	}
	const details = new Map<string, NFTTokenDetails>()
	await Promise.all(
		[...idsByCollection.entries()].map(async ([collection, ids]) => {
			try {
				const tokens = await getTokensDetails(collection, [...ids])
				tokens.forEach(t => details.set(`${collection}/${t.tokenId}`, t))
			} catch {
				// Placeholders below.
			}
		})
	)
	return entries.map(a => {
		const { buyer, seller } = activityParties(a)
		return {
			id: a.id,
			kind: a.kind,
			type: kindToType(a.kind),
			timestamp: a.timestamp * 1000,
			height: a.height,
			terraFinderUrl: activityExplorerUrl(network, a),
			tokenDetails: details.get(`${a.collection}/${a.token_id}`) ?? placeholderToken(a.collection, a.token_id),
			price: fromUluna(a.price),
			currency: 'LUNA',
			buyer,
			seller,
		}
	})
}

const cursors = new CursorBook()

async function runQuery(filter: marketplace.ActivityFilter, query: LatestTransactionsQuery): Promise<LatestTransactionsResult> {
	const offset = Math.max(0, query.offset || 0)
	const limit = Math.max(1, query.limit || 20)
	if (!marketplace.isDeployed()) return { latestTransactions: [], currentOffset: offset }

	const kinds = typesToKinds(query.type)
	// Every requested type was unknown: nothing can match.
	if (kinds && kinds.length === 0) return { latestTransactions: [], currentOffset: offset }
	const fullFilter = { ...filter, kinds }
	const key = JSON.stringify([getNetwork().chainId, fullFilter])

	const startBefore = cursors.get(key, offset)
	if (startBefore === null) return { latestTransactions: [], currentOffset: offset }

	const { activity, next } = await marketplace.getActivity(fullFilter, startBefore, limit)
	const currentOffset = offset + activity.length
	cursors.set(key, currentOffset, next)
	return { latestTransactions: await toTransactionDetails(activity), currentOffset }
}

/** Marketplace-wide history (optionally one collection). */
export function getLatestTransactions(query: LatestTransactionsQuery): Promise<LatestTransactionsResult> {
	return runQuery({ collection: query.nftContractAddress || undefined }, query)
}

/** History where the connected wallet acted or was the counterparty. */
export async function getTransactionsForUser(query: LatestTransactionsQuery): Promise<LatestTransactionsResult> {
	const user = await getWalletAddress()
	return runQuery({ collection: query.nftContractAddress || undefined, user }, query)
}

/** History of one token (`query.nftContractAddress` is required). */
export function getTransactionsForToken(query: LatestTransactionsQuery, tokenId: string): Promise<LatestTransactionsResult> {
	if (!query.nftContractAddress) {
		return Promise.resolve({ latestTransactions: [], currentOffset: query.offset || 0 })
	}
	return runQuery({ collection: query.nftContractAddress, tokenId }, query)
}
