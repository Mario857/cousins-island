import Button from '../Button/Button'
import { WalletIcon } from 'theme/icons'
import React, { useEffect } from 'react'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import WalletNotConnected from './WalletNotConnected'
import WalletConnected from './WalletConnected'
import blockchain from 'utils/blockchain/blockchain'
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

	const wallet = useWallet()
	const { status } = wallet

	const dispatch = useDispatch()

	useEffect(() => {
		if (status === WalletStatus.WALLET_CONNECTED) {
			dispatch(getBalance() as any)
		}
	}, [wallet])

	const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setAnchorEl(null)
	}

	switch (status) {
		case WalletStatus.INITIALIZING:
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
		case WalletStatus.WALLET_NOT_CONNECTED:
			return (
				<WalletNotConnected
					open={open}
					anchorEl={anchorEl}
					handleCloseMenu={handleCloseMenu}
					handleOpenMenu={handleOpenMenu}
					isPrimary={isPrimary}
					btnNotConnectedId={btnNotConnectedId}
					btnConnectedId={btnConnectedId}
				/>
			)
		case WalletStatus.WALLET_CONNECTED:
			return (
				<WalletConnected
					open={open}
					anchorEl={anchorEl}
					handleCloseMenu={handleCloseMenu}
					handleOpenMenu={handleOpenMenu}
					btnNotConnectedId={btnNotConnectedId}
					btnConnectedId={btnConnectedId}
				/>
			)
	}
}

export default WalletSelector
