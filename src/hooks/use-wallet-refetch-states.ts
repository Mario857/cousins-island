import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useWallet } from 'wallet'

/**
 * Re-reads the wallet account on navigation, and reloads the page when the
 * user switches to another account in the wallet (pages cache per-address data).
 * Connecting or disconnecting doesn't reload.
 */
export const useWalletRefetchStates = () => {
	const { refetchStates, wallets } = useWallet()
	const location = useLocation()
	const address = wallets[0]?.terraAddress ?? null
	const prevAddress = useRef<string | null>(address)

	useEffect(() => {
		refetchStates()
		// Only on navigation; refetchStates changes identity with the account.
	}, [location.pathname])

	useEffect(() => {
		const prev = prevAddress.current
		prevAddress.current = address
		if (prev && address && prev !== address) {
			window.location.reload()
		}
	}, [address])
}

const WalletRefetchStates = () => {
	useWalletRefetchStates()
	return null
}

export default WalletRefetchStates
