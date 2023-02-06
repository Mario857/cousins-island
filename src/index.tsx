import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import {
	getChainOptions,
	WalletProvider,
	NetworkInfo,
} from '@terra-money/wallet-provider'
import { Provider } from 'react-redux'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/libre-franklin/400.css'
import '@fontsource/libre-franklin/500.css'
import '@fontsource/libre-franklin/600.css'
import '@fontsource/libre-franklin/700.css'
import { BrowserRouter } from 'react-router-dom'
// import isUserOnStageMarketplace from 'utils/isUserOnStageMarketplace'
import { store } from 'store/store'

function getNetwork(
	networks: Record<number, NetworkInfo>,
	defaultNetwork: NetworkInfo
): NetworkInfo {
	return (
		Object.values(networks).find((n: NetworkInfo) => n.name === 'mainnet') ||
		defaultNetwork
	)
}

getChainOptions().then(chainOptions => {
	ReactDOM.render(
		<React.StrictMode>
			<WalletProvider
				defaultNetwork={getNetwork(
					chainOptions.walletConnectChainIds,
					chainOptions.defaultNetwork
				)}
				walletConnectChainIds={chainOptions.walletConnectChainIds}
			>
				<Provider store={store}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</Provider>
			</WalletProvider>
		</React.StrictMode>,
		document.getElementById('root')
	)
})
