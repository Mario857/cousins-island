import { describe, expect, it } from 'vitest'
import { NETWORKS } from 'config/networks'
import { activityExplorerUrl } from '../activity'
import { selectNotifications } from '../user-notifications'
import { getKeplrMobileDeepLink, isMobileDevice } from 'components/WalletSelector/mobile'
import { parseCoinGeckoPrice } from '../luna-price'
import type { Activity } from '../types'

const ME = 'terra1me'

function entry(id: number, kind: Activity['kind'], actor: string, counterparty: string | null = null, tokenId = '1'): Activity {
	return { id, kind, collection: 'terra1c', token_id: tokenId, actor, counterparty, price: '1000000', timestamp: id, height: 100 + id }
}

describe('activityExplorerUrl', () => {
	it('links to the block on mainnet and the actor elsewhere', () => {
		expect(activityExplorerUrl(NETWORKS['phoenix-1'], { height: 123, actor: ME })).toBe('https://terra.valopers.com/blocks/123')
		expect(activityExplorerUrl(NETWORKS['pisco-1'], { height: 123, actor: ME })).toBe(NETWORKS['pisco-1'].explorerAddress(ME))
	})
})

describe('selectNotifications', () => {
	it('keeps sales of my listings and bids on my listed tokens', () => {
		const entries = [
			entry(1, 'sale', 'terra1buyer', ME), // someone bought from me
			entry(2, 'sale', ME, 'terra1seller'), // I bought: not a notification
			entry(3, 'bid', 'terra1bidder', null, '1'), // bid on my listed token
			entry(4, 'bid', 'terra1bidder', null, '2'), // bid on a token I don't list
			entry(5, 'bid', ME, null, '1'), // my own bid
			entry(3, 'bid', 'terra1bidder', null, '1'), // duplicate
			entry(6, 'list', ME),
		]
		const selected = selectNotifications(ME, entries, new Set(['terra1c/1']))
		expect(selected.map(a => a.id)).toEqual([3, 1])
	})
})

describe('Keplr mobile deep link', () => {
	it('encodes the current page URL', () => {
		expect(getKeplrMobileDeepLink('https://cousins.io/collections?x=1&y=2')).toBe(
			'https://deeplink.keplr.app/web-browser?url=https%3A%2F%2Fcousins.io%2Fcollections%3Fx%3D1%26y%3D2'
		)
	})

	it('detects phones', () => {
		expect(isMobileDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(true)
		expect(isMobileDevice('Mozilla/5.0 (Linux; Android 14; Pixel 8)')).toBe(true)
		expect(isMobileDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)')).toBe(false)
	})
})

describe('parseCoinGeckoPrice', () => {
	it('reads the USD price', () => {
		expect(parseCoinGeckoPrice({ 'terra-luna-2': { usd: 0.21 } })).toBe(0.21)
		expect(parseCoinGeckoPrice({})).toBeNull()
		expect(parseCoinGeckoPrice(null)).toBeNull()
		expect(parseCoinGeckoPrice({ 'terra-luna-2': { usd: 'x' } })).toBeNull()
	})
})
