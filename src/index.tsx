import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/libre-franklin/400.css'
import '@fontsource/libre-franklin/500.css'
import '@fontsource/libre-franklin/600.css'
import '@fontsource/libre-franklin/700.css'
import App from './components/App'
import { store } from 'store/store'
import { WalletProvider } from 'wallet'

// styled-components v6 forwards every prop to the DOM; keep v5's behaviour of
// only forwarding valid HTML attributes (custom props like `isActive` stay in styles).
function shouldForwardProp(prop: string, target: unknown) {
	return typeof target === 'string' ? isPropValid(prop) : true
}

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<WalletProvider>
				<Provider store={store}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</Provider>
			</WalletProvider>
		</StyleSheetManager>
	</React.StrictMode>
)
