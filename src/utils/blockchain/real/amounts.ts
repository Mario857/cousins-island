import Big from 'big.js'
import type { Coin } from '@cosmjs/amino'
import type { TerraCurrency } from '../blockchain.interface'

// LUNA has 6 decimals: 1 LUNA = 1_000_000 uluna.
export const LUNA_DECIMALS = 6
export const LUNA_DENOM = 'uluna'

const MICRO = new Big(10).pow(LUNA_DECIMALS)

/**
 * User-facing LUNA amount -> integer uluna string (never negative).
 * Numbers are first cut to 12 significant digits so float noise from
 * arithmetic (0.3 - 0.1 = 0.19999999999999998) doesn't lose 1 uluna;
 * anything beyond 6 decimals is then dropped.
 */
export function toUluna(amount: number | string): string {
	let value: Big
	try {
		value = new Big(typeof amount === 'number' ? Number(amount.toPrecision(12)) : amount)
	} catch {
		throw new Error(`Invalid amount: ${amount}`)
	}
	if (value.lt(0)) throw new Error(`Invalid amount: ${amount}`)
	return value.times(MICRO).round(0, Big.roundDown).toFixed(0)
}

/** uluna (string or number, as returned by the chain) -> LUNA as a JS number. */
export function fromUluna(amount: string | number | null | undefined): number {
	if (amount === null || amount === undefined || amount === '') return 0
	try {
		return Number(new Big(amount).div(MICRO).toFixed())
	} catch {
		return 0
	}
}

/** Formats coins like "0.0123 LUNA" (several denoms are joined with ", "). */
export function formatCoins(coins: readonly Coin[] | undefined): string {
	if (!coins || coins.length === 0) return '0 LUNA'
	return coins
		.map(c =>
			c.denom === LUNA_DENOM
				? `${new Big(c.amount).div(MICRO).toFixed()} LUNA`
				: `${c.amount} ${c.denom}`
		)
		.join(', ')
}

/** Basis points -> "2.5%". */
export function bpsToPercent(bps: number | undefined): string {
	return `${new Big(bps ?? 0).div(100).toFixed()}%`
}

/** The marketplace only accepts LUNA; this guards the old UST code paths in the UI. */
export function assertLuna(currency: TerraCurrency | string | undefined): void {
	if (currency && currency !== 'LUNA') {
		throw new Error(`Only LUNA is supported (got ${currency})`)
	}
}

export function lunaCoins(amount: number | string): Coin[] {
	return [{ denom: LUNA_DENOM, amount: toUluna(amount) }]
}
