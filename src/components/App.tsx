import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import Router from './Router'
import theme from 'theme/theme'
import GlobalStyles from './Global.styled'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet, WalletStatus } from 'wallet'
import { getCollections } from 'store/actions/collections'
import { getNotifications } from 'store/actions/notifications'
import blockchain from 'utils/blockchain/blockchain'
import WalletRefetchStates from 'hooks/use-wallet-refetch-states'

const App = () => {
	const wallet = useWallet()

	// The blockchain layer signs transactions with the connected wallet.
	blockchain.setWallet(wallet.session)

	const dispatch = useDispatch()

	// Collections feed the home, collections, activity and account pages.
	useEffect(() => {
		dispatch(getCollections() as any)
	}, [dispatch])

	const connectedAddress =
		wallet.status === WalletStatus.WALLET_CONNECTED ? wallet.session?.address : undefined

	useEffect(() => {
		if (connectedAddress) dispatch(getNotifications() as any)
	}, [dispatch, connectedAddress])

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<StyledThemeProvider theme={theme}>
					<GlobalStyles />
					<WalletRefetchStates />
					<Router />
				</StyledThemeProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default App
