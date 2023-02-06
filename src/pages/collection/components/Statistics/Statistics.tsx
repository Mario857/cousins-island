import blockchain from 'utils/blockchain/blockchain'
import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Card from 'components/Card/Card'
import Typography from '@mui/material/Typography'
import { formatLUNADecimal } from 'utils/currency'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface StatisticsParams {
	nftContractAddress: string
}

const Statistics: React.FC<StatisticsParams> = React.memo(
	({ nftContractAddress }) => {
		const [statistics, setStatistics] = useState<{
			floorPrice: number
			last24hVolume: number
			totalVolume: number
		} | null>(null)

		const getCollectionStatistics = async () => {
			try {
				const promises = []
				let statistics = {
					floorPrice: 0,
					last24hVolume: 0,
					totalVolume: 0,
				}

				promises.push(
					blockchain
						.getFloorPriceInCollection(nftContractAddress)
						.then((floorPrice: any) => (statistics.floorPrice = floorPrice))
				)
				promises.push(
					blockchain
						.getLast24hVolumeInCollection(nftContractAddress)
						.then((last24hVolume: any) => (statistics.last24hVolume = last24hVolume))
				)
				promises.push(
					blockchain
						.getTotalVolumeInCollection(nftContractAddress)
						.then((totalVolume: any) => (statistics.totalVolume = totalVolume))
				)

				// We use Promise.allSettled (not Promise.all) to avoid blocking
				// successfull promises by any failed promise
				await Promise.allSettled(promises)

				setStatistics(statistics)
			} catch (error) {
				console.log(error)
				setStatistics(null)
			}
		}

		useEffect(() => {
			if (!statistics) getCollectionStatistics()
		}, [])

		const cards = [
			{
				name: 'Floor price:',
				value: statistics?.floorPrice,
			},
			{
				name: 'Last 24h volume:',
				value: statistics?.last24hVolume,
			},
			{
				name: 'Total volume:',
				value: statistics?.totalVolume,
			},
		]

		return (
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				mt={{ xs: 4, md: 0 }}
			>
				{cards
					.filter(c => c.value || c.value === 0)
					.map((card, index) => (
						<Card sx={{ px: 2, py: '12px' }} key={`statistics-card-${index}`}>
							<Stack
								direction='row'
								alignItems='center'
								justifyContent='space-between'
								spacing={1}
							>
								<Typography variant='body2' color='text.secondary' noWrap>
									{card.name}
								</Typography>
								<Stack direction='row' alignItems='center' spacing={1}>
									<Typography variant='body2' color='text.primary' noWrap>
										{formatLUNADecimal(card.value || 0)}
									</Typography>
									<LazyLoadImage
										src='/images/luna.png'
										alt='Terra Luna'
										width='16px'
										height='16px'
									/>
								</Stack>
							</Stack>
						</Card>
					))}
			</Stack>
		)
	}
)

export default Statistics
