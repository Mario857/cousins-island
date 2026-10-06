import type { TxReceipt } from '../blockchain.interface'
import { errorMessage, queryContract, withTimeout } from './chain'
import { FALLBACK_IPFS_GATEWAY, getIpfsGateway, resolveUri, toFallbackGateway } from './media'
import type { NftExtension, NftInfoResponse } from './types'
import { encodeHookMsg, executeContract } from './tx'

// cw721 v0.20 queries (cw721-metadata-onchain), plus token_uri JSON metadata
// for collections that keep metadata off chain.

const PAGE_LIMIT = 100 // cw721 allows up to 1000; keep responses small.
const METADATA_FETCH_TIMEOUT_MS = 10_000

export async function getNumTokens(nftContractAddress: string): Promise<number> {
	const res = await queryContract<{ count: number }>(nftContractAddress, { num_tokens: {} })
	return Number(res.count) || 0
}

export async function getAllTokenIds(nftContractAddress: string, max: number): Promise<{ ids: string[]; truncated: boolean }> {
	const ids: string[] = []
	let startAfter: string | undefined
	while (ids.length < max) {
		const limit = Math.min(PAGE_LIMIT, max - ids.length)
		const res = await queryContract<{ tokens: string[] }>(nftContractAddress, {
			all_tokens: { start_after: startAfter, limit },
		})
		const tokens = res.tokens ?? []
		ids.push(...tokens)
		if (tokens.length < limit) return { ids, truncated: false }
		startAfter = tokens[tokens.length - 1]
	}
	return { ids, truncated: true }
}

/** One page of token ids owned by `owner`. */
export async function getTokenIdsOwnedBy(
	nftContractAddress: string,
	owner: string,
	startAfter?: string,
	limit = 30
): Promise<string[]> {
	const res = await queryContract<{ tokens: string[] }>(nftContractAddress, {
		tokens: { owner, start_after: startAfter, limit },
	})
	return res.tokens ?? []
}

/** All token ids owned by `owner` (up to `max`). */
export async function getAllTokenIdsOwnedBy(nftContractAddress: string, owner: string, max = 1000): Promise<string[]> {
	const ids: string[] = []
	let startAfter: string | undefined
	while (ids.length < max) {
		const page = await getTokenIdsOwnedBy(nftContractAddress, owner, startAfter, PAGE_LIMIT)
		ids.push(...page)
		if (page.length < PAGE_LIMIT) break
		startAfter = page[page.length - 1]
	}
	return ids
}

export async function getOwnerOf(nftContractAddress: string, tokenId: string): Promise<string> {
	const res = await queryContract<{ owner: string }>(nftContractAddress, {
		owner_of: { token_id: tokenId },
	})
	return res.owner
}

export function getNftInfo(nftContractAddress: string, tokenId: string): Promise<NftInfoResponse> {
	return queryContract<NftInfoResponse>(nftContractAddress, { nft_info: { token_id: tokenId } })
}

export async function getCollectionInfo(nftContractAddress: string): Promise<{ name: string; symbol: string } | null> {
	try {
		return await queryContract<{ name: string; symbol: string }>(nftContractAddress, {
			get_collection_info_and_extension: {},
		})
	} catch {
		try {
			return await queryContract<{ name: string; symbol: string }>(nftContractAddress, { contract_info: {} })
		} catch {
			return null
		}
	}
}

// token_uri JSON ------------------------------------------------------------

const jsonCache = new Map<string, Promise<NftExtension | null>>()

async function fetchJson(url: string): Promise<unknown> {
	const controller = new AbortController()
	const res = await withTimeout(
		fetch(url, { signal: controller.signal }).then(r => {
			if (!r.ok) throw new Error(`HTTP ${r.status}`)
			return r.json()
		}),
		METADATA_FETCH_TIMEOUT_MS,
		`Fetching ${url}`
	).catch(e => {
		controller.abort()
		throw e
	})
	return res
}

/** Off-chain metadata JSON behind a token_uri (null when unavailable or not JSON). */
export function fetchTokenUriMetadata(tokenUri: string): Promise<NftExtension | null> {
	const cached = jsonCache.get(tokenUri)
	if (cached) return cached
	const promise = (async () => {
		const primary = resolveUri(tokenUri)
		if (!/^https?:\/\//i.test(primary)) return null
		const candidates = [primary]
		const fallback = toFallbackGateway(primary, getIpfsGateway())
		if (fallback) candidates.push(fallback)
		else if (tokenUri.startsWith('ipfs://')) candidates.push(resolveUri(tokenUri, FALLBACK_IPFS_GATEWAY))
		for (const url of candidates) {
			try {
				const json = await fetchJson(url)
				return json && typeof json === 'object' ? (json as NftExtension) : null
			} catch (e) {
				console.warn(`Could not load token metadata from ${url}: ${errorMessage(e)}`)
			}
		}
		return null
	})()
	jsonCache.set(tokenUri, promise)
	return promise
}

/** On-chain extension when present, otherwise token_uri JSON, merged (on-chain wins). */
export async function resolveMetadata(info: NftInfoResponse): Promise<NftExtension | null> {
	const onChain = info.extension ?? null
	const hasOnChainContent = Boolean(onChain && (onChain.image || onChain.image_data || onChain.name || onChain.attributes?.length))
	if (hasOnChainContent || !info.token_uri) return onChain
	const offChain = await fetchTokenUriMetadata(info.token_uri)
	if (!offChain) return onChain
	const merged: NftExtension = { ...offChain }
	for (const [key, value] of Object.entries(onChain ?? {})) {
		if (value !== null && value !== undefined && value !== '') (merged as Record<string, unknown>)[key] = value
	}
	return merged
}

// Transactions --------------------------------------------------------------

export function transferToken(nftContractAddress: string, tokenId: string, recipient: string): Promise<TxReceipt> {
	return executeContract({
		contractAddress: nftContractAddress,
		msg: { transfer_nft: { recipient, token_id: tokenId } },
	})
}

/** `send_nft` to a contract with a JSON hook message. */
export function sendNft(
	nftContractAddress: string,
	tokenId: string,
	contract: string,
	hookMsg: Record<string, unknown>
): Promise<TxReceipt> {
	return executeContract({
		contractAddress: nftContractAddress,
		msg: { send_nft: { contract, token_id: tokenId, msg: encodeHookMsg(hookMsg) } },
	})
}
