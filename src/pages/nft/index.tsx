import Layout from 'components/Layout/Layout'
import * as ROUTES from 'constants/routes'
import Grid from '@mui/material/Grid'
import Trade from './components/Trade/Trade'
import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import { useEffect } from 'react'
import {
	getTokenDetails,
	getCollection,
	getUserTradingDetails,
	getAllBidsForToken,
} from 'store/actions/token'
import { RouteComponentProps, useLocation } from 'react-router-dom'
import Fade from '@mui/material/Fade'
import Token from './components/Token/Token'
import CollectionDetails from './components/Token/CollectionDetails'
import Card from 'components/Card/Card'

interface MatchParams {
	collectionAddress: string
	tokenId: string
}

const NFTDetailsPage: React.FC<RouteComponentProps<MatchParams>> = props => {
	const nftContractAddress = props.match.params.collectionAddress
	const tokenId = props.match.params.tokenId
	const { tokenDetails, collection, tokenLoaders } = useSelector(
		(state: State) => state.token
	)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getTokenDetails(nftContractAddress, tokenId) as any)
		dispatch(getCollection(nftContractAddress) as any)
		dispatch(getUserTradingDetails(nftContractAddress, tokenId) as any)
		dispatch(getAllBidsForToken(nftContractAddress, tokenId) as any)
	}, [dispatch])

	const location = useLocation()
	const locationState = location.state as { query: string }
	const previousQuery: string = locationState?.query ? locationState?.query : ''

	const breadcrumbs = [
		{
			title: 'Homepage',
			href: ROUTES.HOME,
		},
		{
			title: 'Collections',
			href: ROUTES.COLLECTIONS,
		},
		{
			title: collection?.title || '',
			href: `${ROUTES.COLLECTIONS}/${nftContractAddress}${
				previousQuery ? previousQuery : ''
			}`,
		},
		{
			title: `#${tokenDetails?.tokenId}`,
		},
	]

	return (
		<Layout
			breadcrumbs={breadcrumbs}
			container='secondary'
			loading={
				tokenLoaders?.getCollection ||
				tokenLoaders?.getTokenDetails ||
				tokenLoaders?.getUserTradingDetails
			}
		>
			{tokenDetails && collection && (
				<Fade in={true}>
					<div>
						<Grid container spacing={{ xs: 0, md: 4 }}>
							<Grid item xs={12} md={6}>
								<Box position={{ md: 'sticky' }} top={{ md: '32px' }}>
									<Token
										previousQuery={previousQuery}
										isVideo={Boolean(collection.isVideo)}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} md={6}>
								<Trade previousQuery={previousQuery} />
							</Grid>
						</Grid>
						<Card sx={{ p: 0, display: { md: 'none' }, mt: { xs: 4, md: 0 } }}>
							<CollectionDetails previousQuery={previousQuery} />
						</Card>
					</div>
				</Fade>
			)}
		</Layout>
	)
}

export default NFTDetailsPage
