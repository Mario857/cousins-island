import Layout from 'components/Layout/Layout'
import React from 'react'
import * as ROUTES from 'constants/routes'
import Header from '../Header/Header'
import Tabs from 'components/Tabs/Tabs'
import Tab from 'components/Tabs/Tab'
import { useHistory, useLocation } from 'react-router-dom'

const AccountLayout: React.FC = ({ children }) => {
	const history = useHistory()
	const location = useLocation()

	const breadcrumbs = [
		{
			title: 'Homepage',
			href: ROUTES.HOME,
		},
		{
			title: 'My Account',
		},
	]

	const tabs = [
		// {
		//   label: 'Details',
		//   value: ROUTES.ACCOUNT,
		// },
		{
			label: `Owned`,
			value: ROUTES.ACCOUNT_OWNED,
		},
		{
			label: `On Sale`,
			value: ROUTES.ACCOUNT_ON_SALE,
		},
		{
			label: 'My Bids',
			value: ROUTES.ACCOUNT_ACTIVITY,
		},

		// {
		//   label: 'Liked',
		//   value: ROUTES.ACCOUNT_LIKED,
		// },
		// {
		//   label: 'Boxes',
		//   value: ROUTES.ACCOUNT_BOXES,
		// },
	]

	const handleChange = (event: React.SyntheticEvent, value: string) => {
		history.push(value)
	}

	return (
		<Layout breadcrumbs={breadcrumbs}>
			<Header heading='My Account' />
			<Tabs
				value={location.pathname}
				onChange={handleChange}
				indicatorColor='secondary'
				textColor='inherit'
				variant='fullWidth'
				TabIndicatorProps={{
					style: {
						background: 'white',
						height: 1,
					},
				}}
				sx={{ mb: 4 }}
			>
				{tabs.map((tab, index) => (
					<Tab label={tab.label} value={tab.value} key={`my-account-tab-${index}`} />
				))}
			</Tabs>
			{children}
		</Layout>
	)
}

export default AccountLayout
