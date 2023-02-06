import { Switch, Route } from 'react-router-dom'
import * as ROUTES from 'constants/routes'
import HomePage from 'pages/home'
import CollectionsPage from 'pages/collections'
import CollectionPage from 'pages/collection'
import NFTDetailsPage from 'pages/nft'
import { RouterScrollRestoration } from 'hooks/useRouterScrollRestoration'
import BoxesPage from 'pages/boxes'
import BoxPage from 'pages/box'
import AccountActivityPage from 'pages/account/activity'
import AccountLayout from 'pages/account/components/AccountLayout/AccountLayout'
import AccountOnSalePage from 'pages/account/on-sale'
import AccountOwnedPage from 'pages/account/owned'

import PrivateRoute from './PrivateRoute/PrivateRoute'
import PrivacyPolicyPage from 'pages/privacy-policy'
import TermsOfServicePage from 'pages/tos'
import ActivityPage from 'pages/activity'
import ActivityLayout from 'pages/activity/components/ActivityLayout/ActivityLayout'
import MyActivityPage from 'pages/activity/my-activity'
import LuartWalletPage from 'pages/account/wallet'

const Router = () => {
	return (
		<>
			<Switch>
				{/* <Route exact path={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyPage} />
				<Route exact path={ROUTES.TOS} component={TermsOfServicePage} /> */}
				<Route exact path={ROUTES.HOME} component={HomePage} />
				{/* <Route exact path={ROUTES.COLLECTIONS} component={CollectionsPage} />
				<Route
					exact
					path={`${ROUTES.COLLECTIONS}/:collectionAddress`}
					component={CollectionPage}
				/>
				<Route
					exact
					path={`${ROUTES.COLLECTIONS}/:collectionAddress/:tokenId`}
					component={NFTDetailsPage}
				/>
				<PrivateRoute
					path='/account'
					render={() => {
						return (
							<AccountLayout>
								<Switch>
									<Route
										exact
										path={ROUTES.ACCOUNT_ON_SALE}
										component={AccountOnSalePage}
									/>
									<Route
										exact
										path={ROUTES.ACCOUNT_OWNED}
										component={AccountOwnedPage}
									/>
									<Route
										exact
										path={ROUTES.ACCOUNT_ACTIVITY}
										component={AccountActivityPage}
									/>
									<Route exact path={ROUTES.LUART_WALLET} component={LuartWalletPage} />
								</Switch>
							</AccountLayout>
						)
					}}
				/>
				<Route
					path={ROUTES.ACTIVITY}
					render={() => {
						return (
							<ActivityLayout>
								<Switch>
									<Route exact path={ROUTES.ALL_ACTIVITY} component={ActivityPage} />
									<PrivateRoute
										exact
										path={ROUTES.MY_ACTIVITY}
										component={MyActivityPage}
									/>
								</Switch>
							</ActivityLayout>
						)
					}}
				/>
				<Route exact path={ROUTES.BOXES} component={BoxesPage} />
				<Route exact path={`${ROUTES.BOXES}/:id`} component={BoxPage} /> */}
			</Switch>
			{/* <RouterScrollRestoration /> */}
		</>
	)
}

export default Router
