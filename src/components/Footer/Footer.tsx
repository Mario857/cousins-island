import {
	StyledFooter,
	StyledHeading,
	StyledLogo,
	StyledBottomLinks,
	StyledLinks,
	StyledLink,
} from './Footer.styled'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import * as ROUTES from 'constants/routes'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import SignUpForm from './SignUpForm'
import Container from 'components/Container/Container'

const Footer = () => {
	const bottomLinks = [
		{
			name: 'Terms',
			href: ROUTES.TOS,
		},
		{
			name: 'Privacy Policy',
			href: ROUTES.PRIVACY_POLICY,
		},
		{
			name: 'Pricing & Fees',
			href: ROUTES.PRICING,
		},
		{
			name: 'Download Branding',
			href: ROUTES.BRANDING,
		},
	]

	const socialLinks = [
		{
			name: 'Telegram',
			href: ROUTES.TELEGRAM,
		},
		{
			name: 'Twitter',
			href: ROUTES.TWITTER,
		},
		{
			name: 'Medium',
			href: ROUTES.MEDIUM,
		},
		{
			name: 'Discord',
			href: ROUTES.DISCORD,
		},
	]

	const platformLinks = [
		{
			name: 'NFT Launchpad',
			href: ROUTES.LAUNCHPAD,
		},
		{
			name: 'NFT Marketplace',
			href: ROUTES.HOME,
		},
		{
			name: 'Website',
			href: ROUTES.LANDING_PAGE,
		},
	]

	const renderLink = (link: { href: string; name: string }) => {
		const isExternal = !link.href.startsWith('/')

		return isExternal ? (
			<a href={link.href} target='_blank' rel='noreferrer'>
				{link.name}
			</a>
		) : (
			<Link to={link.href}>{link.name}</Link>
		)
	}

	const gridItems = [
		{
			heading: 'Apply to Launch NFTs',
			renderChildren: () => {
				return (
					<Typography
						variant='body2'
						color='text.primary'
						sx={{ lineHeight: '26px' }}
					>
						<StyledLink
							target='_blank'
							rel='noopener noreferrer'
							href={ROUTES.APPLICATION_FORM}
						>
							Apply today
						</StyledLink>{' '}
						to launch or list your <br /> NFT project on Cousin Island's launchpad <br />{' '}
						and/or marketplace. We're taking <br /> a curated approach to project{' '}
						<br />
						listings on our launchpad.
					</Typography>
				)
			},
		},
		{
			heading: 'Platform CousinIsland.io',
			renderChildren: () => {
				return (
					<StyledLinks>
						{platformLinks.map((link, index) => (
							<li key={`platform-link-${index}`}>{renderLink(link)}</li>
						))}
					</StyledLinks>
				)
			},
		},
		{
			heading: 'Social Media',
			renderChildren: () => {
				return (
					<StyledLinks>
						{socialLinks.map((link, index) => (
							<li key={`social-link-${index}`}>{renderLink(link)}</li>
						))}
					</StyledLinks>
				)
			},
		},
	]

	return (
		<StyledFooter>
			<Container>
				<Grid container>
					<Grid item xs={12} md={3}>
						<StyledHeading>Get the latest Cousin Island updates</StyledHeading>
						<SignUpForm />
					</Grid>
					<Grid item xs={12} md={9}>
						<Grid container spacing={4} sx={{ ml: { md: 6 } }}>
							{gridItems.map((item, index) => (
								<Grid
									item
									xs={12}
									md={4}
									sx={{ mb: { xs: 5, mb: 0 } }}
									key={`footer-grid-item-${index}`}
								>
									<StyledHeading>{item.heading}</StyledHeading>
									{item.renderChildren()}
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
				<Grid container sx={{ mt: { xs: 0, md: 8 } }}>
					<Grid item xs={12} md={5} lg={4} order={{ xs: 2, md: 1 }}>
						<Stack
							direction={{ xs: 'column', md: 'row' }}
							alignItems={{ xs: 'flex-start', md: 'center' }}
							spacing={{ xs: 2, md: 1 }}
						>
							<StyledLogo src='/images/logo2.svg' alt='Cousin Island Logo' />
							<span>
								Copyright Cousin Island {new Date().getFullYear()}. All Rights Reserved.
							</span>
						</Stack>
					</Grid>
					<Grid item xs={12} md={7} lg={8} order={{ xs: 1, md: 2 }}>
						<StyledBottomLinks>
							{bottomLinks.map((link, index) => (
								<li key={`footer-nav-link-${index}`}>{renderLink(link)}</li>
							))}
						</StyledBottomLinks>
					</Grid>
				</Grid>
			</Container>
		</StyledFooter>
	)
}

export default Footer
