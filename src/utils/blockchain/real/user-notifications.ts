import _ from 'lodash'
import type { LatestTransactionDetails, NotificationsResult } from '../blockchain.interface'
import { toTransactionDetails } from './activity'
import { mapWithConcurrency } from './collection-data'
import * as marketplace from './marketplace'
import type { Activity } from './types'
import { getWalletAddress } from './wallet-session'

// Notifications: someone bought an NFT you listed, or bid on an NFT you have listed.

const LATEST_VIEWED_NOTIFICATION_TIMESTAMP_KEY = 'luart_latest_viewed_notification_timestamp'
const MAX_NOTIFICATIONS = 100
/** Bids are looked up per listing; cap how many listings we check. */
const MAX_LISTINGS_CHECKED = 50
const BIDS_PER_LISTING = 20

/** Picks the entries that are notifications for `user`, newest first, unique by id. */
export function selectNotifications(user: string, entries: Activity[], listedKeys: Set<string>): Activity[] {
	const relevant = entries.filter(a => {
		// Someone bought your listing.
		if (a.kind === 'sale') return a.counterparty === user && a.actor !== user
		// Someone bid on a token you have listed.
		if (a.kind === 'bid') return a.actor !== user && listedKeys.has(`${a.collection}/${a.token_id}`)
		return false
	})
	return _.uniqBy(relevant, 'id')
		.sort((a, b) => b.id - a.id)
		.slice(0, MAX_NOTIFICATIONS)
}

async function getNewNotifications(): Promise<NotificationsResult> {
	const latestTimestamp = getLatestViewedNotificationTimestamp()
	if (!marketplace.isDeployed()) return { notifications: [], latestTimestamp }
	const user = await getWalletAddress()

	const [sales, listings] = await Promise.all([
		marketplace.getActivity({ user, kinds: ['sale'] }, undefined, MAX_NOTIFICATIONS).then(r => r.activity),
		marketplace.getListingsBySeller(user, MAX_LISTINGS_CHECKED),
	])
	const listedKeys = new Set(listings.map(l => `${l.collection}/${l.token_id}`))
	const bidsPerListing = await mapWithConcurrency(listings, 4, l =>
		marketplace
			.getActivityPage({ collection: l.collection, tokenId: l.token_id, kinds: ['bid'] }, undefined, BIDS_PER_LISTING)
			.then(r => r.activity)
			.catch(() => [] as Activity[])
	)

	const selected = selectNotifications(user, [...sales, ...bidsPerListing.flat()], listedKeys)
	return { notifications: await toTransactionDetails(selected), latestTimestamp }
}

function markNotificationsAsViewed(notifications: LatestTransactionDetails[]): number {
	const currentLatestTimestamp = getLatestViewedNotificationTimestamp()
	const newLatestTimestamp = _.max(notifications.map(n => n.timestamp)) || 0

	if (newLatestTimestamp > currentLatestTimestamp) {
		try {
			localStorage.setItem(LATEST_VIEWED_NOTIFICATION_TIMESTAMP_KEY, String(newLatestTimestamp))
		} catch {
			// Private mode: unread state just won't persist.
		}
	}

	return Math.max(newLatestTimestamp, currentLatestTimestamp)
}

function hasUnreadNotifications(notifications: LatestTransactionDetails[]): boolean {
	const currentLatestTimestamp = getLatestViewedNotificationTimestamp()
	const newLatestTimestamp = _.max(notifications.map(n => n.timestamp)) || 0
	return newLatestTimestamp > currentLatestTimestamp
}

function getLatestViewedNotificationTimestamp(): number {
	let value = 0
	try {
		value = Number(localStorage.getItem(LATEST_VIEWED_NOTIFICATION_TIMESTAMP_KEY))
	} catch {
		return 0
	}
	return Number.isFinite(value) && value > 0 ? value : 0
}

export default {
	getNewNotifications,
	markNotificationsAsViewed,
	hasUnreadNotifications,
}
