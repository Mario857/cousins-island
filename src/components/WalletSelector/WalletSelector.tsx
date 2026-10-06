import Button from '../Button/Button'
import { WalletIcon } from 'theme/icons'
import React, { useCallback, useEffect } from 'react'
import { useWallet, WalletStatus } from 'wallet'
import WalletNotConnected from './WalletNotConnected'
import WalletConnected from './WalletConnected'
import { useDispatch } from 'react-redux'
import { getBalance } from 'store/actions/account'

interface WalletSelectorProps {
	isPrimary?: boolean
	btnNotConnectedId?: string
	btnConnectedId?: string
}

const WalletSelector: React.FC<WalletSelectorProps> = ({
	isPrimary = false,
	btnNotConnectedId = 'not-connected-wallet-button',
	btnConnectedId = 'connected-wallet-button',
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const { status, wallets } = useWallet()
	const address = wallets[0]?.terraAddress

	const dispatch = useDispatch()

	useEffect(() => {
		if (status === WalletStatus.WALLET_CONNECTED && address) {
			dispatch(getBalance() as any)
		}
	}, [status, address, dispatch])

	// Close the menu when the wallet connects/disconnects (the button changes).
	useEffect(() => {
		setAnchorEl(null)
	}, [status])

	const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
		// Refresh the balance whenever the connected menu opens.
		if (status === WalletStatus.WALLET_CONNECTED) dispatch(getBalance() as any)
	}, [status, dispatch])

	const handleCloseMenu = useCallback(() => {
		setAnchorEl(null)
	}, [])

	const menuProps = {
		open,
		anchorEl,
		handleCloseMenu,
		handleOpenMenu,
		btnNotConnectedId,
		btnConnectedId,
	}

	switch (status) {
		case WalletStatus.WALLET_CONNECTED:
			return <WalletConnected {...menuProps} />
		case WalletStatus.WALLET_NOT_CONNECTED:
			return <WalletNotConnected {...menuProps} isPrimary={isPrimary} />
		case WalletStatus.INITIALIZING:
		default:
			return (
				<Button
					variant='contained'
					color={isPrimary ? 'primary' : 'light'}
					size={isPrimary ? 'large' : 'medium'}
					startIcon={isPrimary ? undefined : <WalletIcon viewBox='0 -2 20 20' />}
					fullWidth={isPrimary}
					sx={{ fontWeight: '400 !important' }}
				>
					Initializing...
				</Button>
			)
	}
}

export default WalletSelector
