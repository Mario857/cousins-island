import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { TerraCurrency } from 'utils/blockchain/blockchain.interface'
import {
	formatDecimal,
	formatLUNADecimal,
	formatUSTDecimal,
} from 'utils/currency'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import { useEffect } from 'react'
import { getLunaPrice } from 'store/actions/statistics'

interface PriceProps {
	sellPriceCurrency?: TerraCurrency | null
	sellPriceAmount?: number | null
	label: string
}

const Price: React.FC<PriceProps> = ({
	sellPriceCurrency,
	sellPriceAmount,
	label,
}) => {
	const { bids, tokenLoaders } = useSelector((state: State) => state.token)
	const { statisticsLoaders, lunaPrice } = useSelector(
		(state: State) => state.statistics
	)

	const dispatch = useDispatch()

	useEffect(() => {
		if (
			!statisticsLoaders?.getLunaPrice &&
			sellPriceCurrency &&
			sellPriceAmount
		) {
			dispatch(getLunaPrice() as any)
		}
	}, [dispatch])

	const isMobile = useMediaQuery({ maxWidth: 991 })

	const highestBid = bids?.highestToLowest?.[0]

	const getConvertedPrice = () => {
		if (sellPriceCurrency && sellPriceAmount && lunaPrice) {
			if (sellPriceCurrency === 'LUNA')
				return formatUSTDecimal(sellPriceAmount * lunaPrice)
			else return formatLUNADecimal(sellPriceAmount / lunaPrice)
		} else return null
	}

	const convertedPrice = getConvertedPrice()

	return (
		<Box p={3}>
			<Typography variant='body3' color='text.primary' component='p'>
				{label}
			</Typography>
			{sellPriceCurrency && sellPriceAmount ? (
				<>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						justifyContent='space-between'
						mt={{ xs: 1, md: 2 }}
					>
						<Stack direction='row' alignItems='center' spacing={1}>
							<LazyLoadImage
								alt={sellPriceCurrency}
								src={
									sellPriceCurrency === 'LUNA'
										? '/images/terra-luna-large.png'
										: '/images/ust-large.png'
								}
								width={isMobile ? '21px' : '28px'}
								height={isMobile ? '21px' : '28px'}
							/>
							<Stack direction='row' alignItems='flex-end'>
								<Typography
									variant='h600'
									color='text.primary'
									component='h3'
									sx={{ lineHeight: '32px !important' }}
								>
									{formatDecimal(sellPriceAmount || 0)}
								</Typography>
								<Typography
									variant={isMobile ? 'h600' : 'h500'}
									color='text.secondary'
									component='h4'
									ml={1}
									sx={{
										lineHeight: {
											xs: '32px !important',
											md: '24px !important',
										},
									}}
								>
									${sellPriceCurrency}
								</Typography>
							</Stack>
						</Stack>
						{convertedPrice && (
							<Typography variant='body4' color='rgba(255, 255, 255, 0.7)'>
								~ {convertedPrice}
							</Typography>
						)}
					</Stack>
					{highestBid && !tokenLoaders?.getAllBidsForToken && (
						<Stack
							direction={{ xs: 'column', md: 'row' }}
							alignItems={{ md: 'center' }}
							spacing={1}
							mt={4}
						>
							<Typography variant='body2' color='text.primary'>
								Highest offer
							</Typography>
							<Stack direction='row' alignItems='center'>
								<LazyLoadImage
									alt={highestBid.currency}
									src={
										highestBid.currency === 'LUNA'
											? '/images/terra-luna-large.png'
											: '/images/ust-large.png'
									}
									width={isMobile ? '18px' : '24px'}
									height={isMobile ? '18px' : '24px'}
								/>
								<Typography
									variant='h200'
									color='text.primary'
									component='h6'
									display='inline-block'
									ml={1}
									mr={1 / 2}
								>
									{formatDecimal(highestBid.amount || 0)}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									${highestBid.currency}
								</Typography>
							</Stack>
						</Stack>
					)}
				</>
			) : (
				<Typography variant='h400' component='h6' color='text.primary' mt={1}>
					Not for sale
				</Typography>
			)}
		</Box>
	)
}

export default Price
