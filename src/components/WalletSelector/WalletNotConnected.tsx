import Button from '../Button/Button'
import { WalletIcon } from 'theme/icons'
import Menu from './Menu'
import MenuItem from './MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useWallet } from 'wallet'
import { getKeplrMobileDeepLink, isMobileDevice } from './mobile'

export interface WalletMenuProps {
	open: boolean
	anchorEl: null | HTMLElement
	handleCloseMenu: () => void
	handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void
	isPrimary?: boolean
	btnNotConnectedId: string
	btnConnectedId: string
}

/** @deprecated Use WalletMenuProps. */
export type WalletNotConnectedProps = WalletMenuProps

const WalletNotConnected: React.FC<WalletMenuProps> = ({
	open,
	anchorEl,
	handleCloseMenu,
	handleOpenMenu,
	isPrimary,
	btnNotConnectedId,
}) => {
	const { availableConnections, availableInstallations, connect, connectError } = useWallet()

	// Phone browsers can't run wallet extensions: offer Keplr's in-app browser instead.
	const showMobileDeepLink = availableConnections.length === 0 && isMobileDevice()

	const handleConnect = (type: (typeof availableConnections)[number]['type'], identifier: string) => {
		handleCloseMenu()
		// The provider stores the error in connectError, which is shown next time the menu opens.
		connect(type, identifier).catch(() => undefined)
	}

	return (
		<>
			<Button
				variant='contained'
				color={isPrimary ? 'primary' : 'light'}
				size={isPrimary ? 'large' : 'medium'}
				id={btnNotConnectedId}
				startIcon={isPrimary ? undefined : <WalletIcon viewBox='0 -2 20 20' />}
				aria-controls={open ? 'not-connected-wallet-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleOpenMenu}
				fullWidth={isPrimary}
				sx={{ fontWeight: '400 !important' }}
			>
				Connect Wallet
			</Button>
			<Menu
				id='not-connected-wallet-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseMenu}
				slotProps={{ list: { 'aria-labelledby': btnNotConnectedId } }}
			>
				<MenuItem disabled>
					<Typography variant='body1' component='span' sx={{ color: 'text.secondary' }}>
						Connect with
					</Typography>
				</MenuItem>
				<Divider />
				{availableConnections.map(({ type, name, identifier }) => (
					<MenuItem key={`wallet-connection-${identifier}`} onClick={() => handleConnect(type, identifier)}>
						<Typography variant='body2' sx={{ color: 'text.primary' }}>
							{name}
						</Typography>
					</MenuItem>
				))}
				{showMobileDeepLink && (
					<MenuItem
						onClick={() => {
							handleCloseMenu()
							window.location.href = getKeplrMobileDeepLink(window.location.href)
						}}
					>
						<Typography variant='body2' sx={{ color: 'text.primary' }}>
							Open in Keplr mobile
						</Typography>
					</MenuItem>
				)}
				{availableInstallations.map(({ identifier, name, url }) => (
					<MenuItem
						key={`wallet-installation-${identifier}`}
						onClick={() => {
							handleCloseMenu()
							window.open(url, '_blank', 'noopener,noreferrer')
						}}
					>
						<Typography variant='body2' sx={{ color: 'text.primary' }}>
							Install {name}
						</Typography>
					</MenuItem>
				))}
				{connectError && <Divider />}
				{connectError && (
					<MenuItem disabled sx={{ height: 'auto !important', whiteSpace: 'normal', maxWidth: 320 }}>
						<Typography variant='body2' role='alert' sx={{ color: 'error.main' }}>
							{connectError}
						</Typography>
					</MenuItem>
				)}
			</Menu>
		</>
	)
}

export default WalletNotConnected
