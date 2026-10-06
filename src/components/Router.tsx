import { Routes, Route, Outlet } from 'react-router-dom'
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

const Router = () => {
	return (
		<>
			<Routes>
				<Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
				<Route path={ROUTES.TOS} element={<TermsOfServicePage />} />
				<Route path={ROUTES.HOME} element={<HomePage />} />
				<Route path={ROUTES.COLLECTIONS} element={<CollectionsPage />} />
				<Route
					path={`${ROUTES.COLLECTIONS}/:collectionAddress`}
					element={<CollectionPage />}
				/>
				<Route
					path={`${ROUTES.COLLECTIONS}/:collectionAddress/:tokenId`}
					element={<NFTDetailsPage />}
				/>
				<Route
					path='/account'
					element={
						<PrivateRoute>
							<AccountLayout>
								<Outlet />
							</AccountLayout>
						</PrivateRoute>
					}
				>
					<Route path={ROUTES.ACCOUNT_ON_SALE} element={<AccountOnSalePage />} />
					<Route path={ROUTES.ACCOUNT_OWNED} element={<AccountOwnedPage />} />
					<Route
						path={ROUTES.ACCOUNT_ACTIVITY}
						element={<AccountActivityPage />}
					/>
					{/* Like the old non-exact parent route: unknown sub-paths still render the layout */}
					<Route path='*' element={null} />
				</Route>
				<Route
					path={ROUTES.ACTIVITY}
					element={
						<ActivityLayout>
							<Outlet />
						</ActivityLayout>
					}
				>
					<Route path={ROUTES.ALL_ACTIVITY} element={<ActivityPage />} />
					<Route
						path={ROUTES.MY_ACTIVITY}
						element={
							<PrivateRoute>
								<MyActivityPage />
							</PrivateRoute>
						}
					/>
					<Route path='*' element={null} />
				</Route>
				<Route path={ROUTES.BOXES} element={<BoxesPage />} />
				<Route path={`${ROUTES.BOXES}/:id`} element={<BoxPage />} />
			</Routes>
			{/* <RouterScrollRestoration /> */}
		</>
	)
}

export default Router
