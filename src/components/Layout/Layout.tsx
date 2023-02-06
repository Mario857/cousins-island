import Navbar from 'components/Navbar/Navbar'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Arrow2RightIcon } from 'theme/icons'
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs'
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb'
import Footer from 'components/Footer/Footer'
import {
	StyledLayout,
	StyledLoaderContainer,
	StyledWrappedContent,
} from './Layout.styled'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import SafetyNotice from 'components/SafetyNotice/SafetyNotice'
import Container from 'components/Container/Container'
import { useSelector } from 'react-redux'
import { State } from 'store/store'
import NotificationsMobile from 'components/Notifications/NotificationsMobile'

interface LayoutProps {
	breadcrumbs?: {
		title: string
		href?: string
	}[]
	container?: 'primary' | 'secondary'
	loading?: boolean
}

const Layout: React.FC<LayoutProps> = ({
	breadcrumbs,
	children,
	loading = false,
}) => {
	const location = useLocation()

	const { notificationsOpenOnMobile } = useSelector(
		(state: State) => state.notifications
	)

	return (
		<>
			<SafetyNotice />
			{notificationsOpenOnMobile && <NotificationsMobile />}
			<StyledLayout
				bg={location.pathname === '/' ? 'secondary' : 'primary'}
				hide={notificationsOpenOnMobile}
			>
				{/* <MigrationBanner /> */}
				<Navbar />
				{/* <Announcement
          severity='error'
          textColor='primary.dark'
          center={true}
          title="Cousin Island is currently under maintenance."
          description="Please try again later, sorry for the inconveniences caused. For more details please visit our Twitter or Discord."
        /> */}
				<div id='layout-container'>
					{loading ? (
						<StyledLoaderContainer>
							<LoadingSpinner size='large' color='secondary' />
						</StyledLoaderContainer>
					) : (
						<Container>
							<StyledWrappedContent>
								{breadcrumbs && breadcrumbs.length > 0 && (
									<Breadcrumbs
										separator={
											<Arrow2RightIcon fontSize='small' viewBox='-6 -8.5 24 24' />
										}
										sx={{ mb: 4 }}
									>
										{breadcrumbs.map((breadcrumb, index) => {
											return (
												breadcrumb.title &&
												breadcrumb.title.length > 0 && (
													<Breadcrumb
														isDisabled={!breadcrumb.href}
														key={`breadcrumb-${index}`}
													>
														<Link to={breadcrumb.href || '#'}>{breadcrumb.title}</Link>
													</Breadcrumb>
												)
											)
										})}
									</Breadcrumbs>
								)}
								{children}
							</StyledWrappedContent>
						</Container>
					)}
					<Footer />
				</div>
			</StyledLayout>
		</>
	)
}

export default Layout
