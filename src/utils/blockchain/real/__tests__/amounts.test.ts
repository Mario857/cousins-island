import { describe, expect, it } from 'vitest'
import { assertLuna, bpsToPercent, formatCoins, fromUluna, lunaCoins, toUluna } from '../amounts'

describe('toUluna', () => {
	it('converts LUNA to integer uluna', () => {
		expect(toUluna(1)).toBe('1000000')
		expect(toUluna(0.000001)).toBe('1')
		expect(toUluna('12.5')).toBe('12500000')
		expect(toUluna(0)).toBe('0')
	})

	it('avoids float errors', () => {
		// 0.1 + 0.2 style issues: 1.005 * 1e6 is 1004999.9999999999 in floats
		expect(toUluna(1.005)).toBe('1005000')
		expect(toUluna(123456.789)).toBe('123456789000')
	})

	it('rounds sub-micro amounts down', () => {
		expect(toUluna(0.0000019)).toBe('1')
	})

	it('rejects invalid and negative input', () => {
		expect(() => toUluna(-1)).toThrow()
		expect(() => toUluna('abc')).toThrow()
	})
})

describe('fromUluna', () => {
	it('converts uluna to LUNA numbers', () => {
		expect(fromUluna('1000000')).toBe(1)
		expect(fromUluna('1')).toBe(0.000001)
		expect(fromUluna(2500000)).toBe(2.5)
		expect(fromUluna('340282366920938463463374607431768211455')).toBeGreaterThan(1e32)
	})

	it('treats missing values as 0', () => {
		expect(fromUluna(undefined)).toBe(0)
		expect(fromUluna(null)).toBe(0)
		expect(fromUluna('')).toBe(0)
		expect(fromUluna('garbage')).toBe(0)
	})
})

describe('formatCoins', () => {
	it('formats the paid fee', () => {
		expect(formatCoins([{ denom: 'uluna', amount: '12300' }])).toBe('0.0123 LUNA')
		expect(formatCoins([{ denom: 'uluna', amount: '1000000' }])).toBe('1 LUNA')
		expect(formatCoins([])).toBe('0 LUNA')
		expect(formatCoins([{ denom: 'uluna', amount: '5' }, { denom: 'ibc/ABC', amount: '7' }])).toBe(
			'0.000005 LUNA, 7 ibc/ABC'
		)
	})
})

describe('bpsToPercent', () => {
	it('formats basis points', () => {
		expect(bpsToPercent(250)).toBe('2.5%')
		expect(bpsToPercent(450)).toBe('4.5%')
		expect(bpsToPercent(0)).toBe('0%')
		expect(bpsToPercent(undefined)).toBe('0%')
		expect(bpsToPercent(1000)).toBe('10%')
	})
})

describe('currency helpers', () => {
	it('only accepts LUNA', () => {
		expect(() => assertLuna('LUNA')).not.toThrow()
		expect(() => assertLuna(undefined)).not.toThrow()
		expect(() => assertLuna('UST')).toThrow(/Only LUNA/)
	})

	it('builds funds', () => {
		expect(lunaCoins(3.25)).toEqual([{ denom: 'uluna', amount: '3250000' }])
	})
})

describe('toUluna float noise', () => {
	it('does not lose 1 uluna on computed amounts', () => {
		expect(toUluna(0.3 - 0.1)).toBe('200000')
		expect(toUluna(1.15 * 3)).toBe('3450000')
		expect(toUluna(4.35)).toBe('4350000')
	})
	it('still drops digits beyond 6 decimals', () => {
		expect(toUluna('1.2345678')).toBe('1234567')
		expect(toUluna(0.0000001)).toBe('0')
	})
})
