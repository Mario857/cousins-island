// Turning on-chain media references (ipfs://, ar://, raw SVG) into URLs a browser can load.

export const DEFAULT_IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
export const FALLBACK_IPFS_GATEWAY = 'https://dweb.link/ipfs/'
const ARWEAVE_GATEWAY = 'https://arweave.net/'

function withTrailingSlash(url: string): string {
	return url.endsWith('/') ? url : `${url}/`
}

export function getIpfsGateway(): string {
	const fromEnv = import.meta.env.VITE_IPFS_GATEWAY
	return withTrailingSlash(fromEnv || DEFAULT_IPFS_GATEWAY)
}

/**
 * Resolves ipfs:// and ar:// URIs to an HTTP gateway URL. http(s) and data: URLs
 * are returned unchanged; empty input gives ''.
 */
export function resolveUri(uri: string | null | undefined, gateway: string = getIpfsGateway()): string {
	if (!uri) return ''
	const trimmed = uri.trim()
	if (!trimmed) return ''

	const lower = trimmed.toLowerCase()
	if (lower.startsWith('ipfs://')) {
		// "ipfs://ipfs/<cid>" is a common mistake; tolerate it.
		const path = trimmed.slice('ipfs://'.length).replace(/^ipfs\//i, '')
		return withTrailingSlash(gateway) + path
	}
	if (lower.startsWith('ar://')) {
		return ARWEAVE_GATEWAY + trimmed.slice('ar://'.length)
	}
	// Bare "/ipfs/<cid>" paths.
	if (lower.startsWith('/ipfs/')) {
		return withTrailingSlash(gateway) + trimmed.slice('/ipfs/'.length)
	}
	return trimmed
}

/** Same URL on the fallback gateway, or null when the URL isn't on the primary IPFS gateway. */
export function toFallbackGateway(url: string, primary: string = getIpfsGateway()): string | null {
	const base = withTrailingSlash(primary)
	if (!url.startsWith(base) || base === FALLBACK_IPFS_GATEWAY) return null
	return FALLBACK_IPFS_GATEWAY + url.slice(base.length)
}

/** cw721 `image_data` holds raw SVG markup; make it usable as an <img src>. */
export function imageDataToUrl(imageData: string | null | undefined): string {
	if (!imageData) return ''
	const trimmed = imageData.trim()
	if (!trimmed) return ''
	if (trimmed.startsWith('data:')) return trimmed
	if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(trimmed)}`
	}
	// Not SVG markup; assume it's base64 SVG.
	return `data:image/svg+xml;base64,${trimmed}`
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i

export function isVideoUrl(url: string | null | undefined): boolean {
	return Boolean(url && VIDEO_EXTENSIONS.test(url))
}

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?.*)?$/i

export function looksLikeImageUrl(url: string | null | undefined): boolean {
	return Boolean(url && IMAGE_EXTENSIONS.test(url))
}
