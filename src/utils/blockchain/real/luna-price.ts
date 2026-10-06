import { withTimeout } from './chain'

// LUNA (Terra 2) price in USD from CoinGecko's public API, cached a few minutes.

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=terra-luna-2&vs_currencies=usd'
const CACHE_MS = 5 * 60_000
const FETCH_TIMEOUT_MS = 6_000
/** Used when CoinGecko can't be reached and nothing was fetched yet. Rough, only for USD hints. */
export const DEFAULT_LUNA_PRICE_USD = 0.15

let cache: { at: number; price: number } | null = null
let inflight: Promise<number> | null = null

export function parseCoinGeckoPrice(json: unknown): number | null {
	const price = (json as { 'terra-luna-2'?: { usd?: unknown } } | null)?.['terra-luna-2']?.usd
	return typeof price === 'number' && Number.isFinite(price) && price > 0 ? price : null
}

export async function getLunaPrice(): Promise<number> {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache.price
	if (!inflight) {
		inflight = (async () => {
			try {
				const res = await withTimeout(fetch(COINGECKO_URL, { headers: { accept: 'application/json' } }), FETCH_TIMEOUT_MS, 'LUNA price')
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const price = parseCoinGeckoPrice(await res.json())
				if (price === null) throw new Error('Unexpected response')
				cache = { at: Date.now(), price }
				return price
			} catch (e) {
				console.warn(`Could not get the LUNA price from CoinGecko (${e instanceof Error ? e.message : e})`)
				// Keep a stale price rather than the constant; retry in a minute.
				const fallback = cache?.price ?? DEFAULT_LUNA_PRICE_USD
				cache = { at: Date.now() - CACHE_MS + 60_000, price: fallback }
				return fallback
			} finally {
				inflight = null
			}
		})()
	}
	return inflight
}

/** For tests. */
export function resetLunaPriceCache() {
	cache = null
	inflight = null
}
