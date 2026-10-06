import Button from '../Button/Button'
import { AngleDownIcon, AngleUpIcon, CopyFileIcon, ExternalLinkIcon, LoginAltIcon, WalletIcon } from 'theme/icons'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { useWallet } from 'wallet'
import useClipboard from 'hooks/useClipboard'
import { getShortText } from 'utils/getShortText'
import { formatLUNADecimal } from 'utils/currency'
import { State } from 'store/store'
import Menu from './Menu'
import MenuItem from './MenuItem'
import type { WalletMenuProps } from './WalletNotConnected'

interface MenuEntry {
	title?: string
	heading?: boolean
	divider?: boolean
	icon?: React.ReactNode
	value?: string
	disabled?: boolean
	tooltip?: boolean
	onClick?: () => void
}

const WalletConnected: React.FC<WalletMenuProps> = ({ open, anchorEl, handleCloseMenu, handleOpenMenu, btnConnectedId }) => {
	const { wallets, disconnect, network } = useWallet()
	const { balance } = useSelector((state: State) => state.account)

	const terraAddress = wallets[0]?.terraAddress ?? ''
	const shortTerraAddress = getShortText(terraAddress, 6)

	const [isCopied, copyAddress] = useClipboard(terraAddress, { successDuration: 1000 })

	const isMobile = useMediaQuery({ maxWidth: 991 })

	const disconnectWallet = useCallback(() => {
		if (!window.confirm('Disconnect your wallet?')) return
		handleCloseMenu()
		disconnect()
	}, [disconnect, handleCloseMenu])

	const menuItems: MenuEntry[] = [
		{ title: shortTerraAddress, heading: true },
		{ divider: true },
		{
			title: 'Copy Address',
			icon: <CopyFileIcon fontSize='small' />,
			tooltip: true,
			onClick: copyAddress,
		},
		{
			title: 'View on Explorer',
			icon: <ExternalLinkIcon fontSize='small' />,
			onClick: () => {
				handleCloseMenu()
				window.open(network.explorerAddress(terraAddress), '_blank', 'noopener,noreferrer')
			},
		},
		{
			title: 'Disconnect Wallet',
			icon: <LoginAltIcon fontSize='small' />,
			onClick: disconnectWallet,
		},
		{ divider: true },
		{ title: 'Wallet Balance', heading: true },
		{ title: '$LUNA', value: formatLUNADecimal(balance.luna), disabled: true },
	]

	const renderMenuItems = (items: MenuEntry[]) =>
		items.map((item, index) => {
			if (item.divider) return <Divider key={`connected-menu-item-${index}`} />
			return (
				<MenuItem key={`connected-menu-item-${index}`} onClick={item.onClick} disabled={item.disabled || item.heading}>
					{item.heading ? (
						<Typography variant='body1' component='span' sx={{ color: 'text.secondary' }}>
							{item.title}
						</Typography>
					) : (
						<Stack direction='row' sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography variant='body2' sx={{ color: 'text.primary' }}>
								{item.title}
							</Typography>
							{item.icon ? (
								item.tooltip ? (
									<Tooltip title='Address copied!' open={isCopied} arrow>
										<Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
									</Tooltip>
								) : (
									<Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
								)
							) : (
								<Typography variant='body1' sx={{ color: 'text.secondary' }}>
									{item.value}
								</Typography>
							)}
						</Stack>
					)}
				</MenuItem>
			)
		})

	return (
		<>
			<Button
				variant='contained'
				color='light'
				size='medium'
				id={btnConnectedId}
				startIcon={<WalletIcon viewBox='0 -2 20 20' />}
				endIcon={!isMobile ? open ? <AngleUpIcon /> : <AngleDownIcon /> : undefined}
				aria-controls={open ? 'wallet-connected-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleOpenMenu}
				sx={{ fontWeight: '400 !important' }}
			>
				{shortTerraAddress}
			</Button>
			<Menu
				id='wallet-connected-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseMenu}
				anchorOrigin={!isMobile ? { vertical: 'bottom', horizontal: 'right' } : { vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={!isMobile ? { vertical: 'top', horizontal: 'right' } : { vertical: 'top', horizontal: 'center' }}
				slotProps={{ list: { 'aria-labelledby': btnConnectedId, sx: { minWidth: { xs: '100%', md: '280px' } } } }}
			>
				{renderMenuItems(menuItems)}
			</Menu>
		</>
	)
}

export default WalletConnected
