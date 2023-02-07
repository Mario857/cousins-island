import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import Router from './Router'
import theme from 'theme/theme'
import GlobalStyles from './Global.styled'
// import { State } from 'store/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCollections } from 'store/actions/collections';
// import { useEffect } from 'react';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import {
	useWallet,
	//  WalletStatus
} from '@terra-money/wallet-provider'
import blockchain from 'utils/blockchain/blockchain'
// import { getNotifications } from 'store/actions/notifications';
import WalletRefetchStates from 'hooks/use-wallet-refetch-states'

const App = () => {
	// const { collections } = useSelector((state: State) => state.collections);
	// const { notifications, notificationsLoaders } = useSelector(
	//   (state: State) => state.notifications
	// );

	// const dispatch = useDispatch();

	const wallet = useWallet()

	blockchain.setWallet(wallet)

	// useEffect(() => {
	//   if (!collections) dispatch(getCollections());

	//   if (
	//     !notifications &&
	//     notificationsLoaders?.getNotifications &&
	//     wallet.status === WalletStatus.WALLET_CONNECTED
	//   ) {
	//     dispatch(getNotifications());
	//   }
	// }, [dispatch, wallet, collections]);

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
