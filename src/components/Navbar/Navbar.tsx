import {
	StyledAppBar,
	StyledLogo,
	StyledNavLink,
	StyledIconButton,
	StyledNavContainer,
	StyledNav,
} from './Navbar.styled'
import Toolbar from '@mui/material/Toolbar'
import Stack from '@mui/material/Stack'
import * as ROUTES from 'constants/routes'
import { Link, useHistory, useLocation } from 'react-router-dom'
import WalletSelector from 'components/WalletSelector/WalletSelector'
import { CloseIcon, MenuIcon } from 'theme/icons'
import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import SecondaryFooter from 'components/SecondaryFooter/SecondaryFooter'
import blockchain from 'utils/blockchain/blockchain'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import Container from 'components/Container/Container'
import TestnetBadge from './TestnetBadge'
import { useMediaQuery } from 'react-responsive'
import NotificationsBell from 'components/Notifications/NotificationsBell'
import NotificationsDesktop from 'components/Notifications/NotificationsDesktop'
import { useDispatch, useSelector } from 'react-redux'
import {
	toggleNotificationsOnMobile,
	markNotificationsAsRead,
} from 'store/actions/notifications'
import { State } from 'store/store'
import Search from './Search/Search'

const Navbar = () => {
	const location = useLocation()
	const history = useHistory()

	const [openMobile, setOpenMobile] = useState(false)

	const wallet = useWallet()

	const isMobile = useMediaQuery({ maxWidth: 1010 })

	const isMediumScreen = useMediaQuery({ maxWidth: 1400 })

	const dispatch = useDispatch()

	const {
		notifications,
		userHasUnreadNotifications,
		notificationsOpenOnMobile,
	} = useSelector((state: State) => state.notifications)

	const navLinks = [
		{
			name: 'Launchpad',
			href: ROUTES.LAUNCHPAD,
		},
		{
			name: 'Marketplace',
			href: ROUTES.HOME,
		},
		{
			name: 'All Collections',
			href: ROUTES.COLLECTIONS,
		},
		{
			name: 'Activity',
			href: ROUTES.ALL_ACTIVITY,
		},
		{
			name: 'My Items',
			href: ROUTES.ACCOUNT_OWNED,
			private: true,
		},
	]

	const shouldShowLayoutComponent = (show: boolean) => {
		const layout = document.getElementById('layout-container')

		if (layout) {
			layout.style.display = show ? 'block' : 'none'
		}
	}

	const handleCloseMobile = useCallback(() => {
		setOpenMobile(false)
		shouldShowLayoutComponent(true)
	}, [openMobile])

	const handleToggleMobile = useCallback(() => {
		setOpenMobile(!openMobile)
		shouldShowLayoutComponent(openMobile)
	}, [openMobile])

	useEffect(() => {
		const resize = () => {
			if (window.innerWidth > 1010) handleCloseMobile()
		}

		window.addEventListener('resize', resize)

		return () => window.removeEventListener('resize', resize)
	}, [])

	useEffect(() => {
		const unlisten = history.listen(handleCloseMobile)

		return unlisten
	}, [])

	const [isTestnet, setIsTestnet] = useState(false)

	useEffect(() => {
		blockchain.isTestnet().then(setIsTestnet)
	}, [])

	const handleOpenNotifications = () => {
		dispatch(toggleNotificationsOnMobile(true))
		if (!notifications) return
		dispatch(markNotificationsAsRead(notifications) as any)
	}

	return (
		<StyledAppBar position='static'>
			<Container>
				<Toolbar>
					<Box mr={{ xs: 0, md: 2, lg: 4 }}>
						<Stack direction='row' alignItems='center' spacing={2}>
							<Link to={ROUTES.HOME} onClick={handleCloseMobile}>
								<StyledLogo
									src={
										isMediumScreen && !isMobile ? '/images/logo2.svg' : '/images/logo.svg'
									}
									alt='Cousin Island Logo'
								/>
							</Link>
							{isTestnet && <TestnetBadge />}
						</Stack>
					</Box>
					<Stack
						direction='row'
						alignItems='center'
						justifyContent={{
							xs: 'flex-end',
							md: 'space-between',
						}}
						sx={{ width: '100%' }}
						spacing={{ xs: 0, md: 2, lg: 4 }}
					>
						<Stack
							direction='row'
							order={{ xs: 3, md: 2 }}
							sx={{ flexGrow: { md: 1 }, position: 'relative' }}
							justifyContent={{
								xs: 'flex-end',
							}}
							spacing={2}
						>
							{!isMobile && <Search />}
							<StyledIconButton onClick={handleToggleMobile}>
								{openMobile ? (
									<CloseIcon fontSize='small' />
								) : (
									<MenuIcon fontSize='small' />
								)}
							</StyledIconButton>
						</Stack>
						<Stack
							direction='row'
							spacing={{ xs: 2, lg: 3 }}
							alignItems='center'
							order={{ xs: 2, md: 3 }}
						>
							<StyledNavContainer open={openMobile}>
								<StyledNav>
									{navLinks.map((link, index) => {
										const isExternal = !link.href.startsWith('/')
										const splittedLink = link.href.split('/')
										const splittedPathname = location.pathname.split('/')

										const isActive =
											link.href === location.pathname ||
											(splittedLink[1] === splittedPathname[1] &&
												location.pathname !== '/')

										return (
											((link.private && wallet.status === WalletStatus.WALLET_CONNECTED) ||
												!link.private) && (
												<StyledNavLink key={`nav-link-${index}`} active={isActive}>
													{isExternal ? (
														<a href={link.href} rel='noreferrer'>
															{link.name}
														</a>
													) : (
														<Link to={link.href}>{link.name}</Link>
													)}
												</StyledNavLink>
											)
										)
									})}
									{!isMobile && wallet.status == WalletStatus.WALLET_CONNECTED && (
										<StyledNavLink>
											<NotificationsDesktop />
										</StyledNavLink>
									)}
								</StyledNav>
								<Box sx={{ display: { xs: 'block', md: 'none' } }}>
									<SecondaryFooter />
								</Box>
							</StyledNavContainer>
							<WalletSelector />
							{isMobile && wallet.status == WalletStatus.WALLET_CONNECTED && (
								<NotificationsBell
									handleOpenNotifications={handleOpenNotifications}
									dot={userHasUnreadNotifications}
									open={notificationsOpenOnMobile}
								/>
							)}
						</Stack>
					</Stack>
				</Toolbar>
				{isMobile && <Search />}
			</Container>
		</StyledAppBar>
	)
}

export default Navbar
