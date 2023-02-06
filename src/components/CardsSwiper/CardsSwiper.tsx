import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { Swiper } from 'swiper/react'
import { StyledButtonWrapper, StyledCardsSwiper } from './CardsSwiper.styled'
import IconButton from 'components/Button/IconButton'
import { AngleLeftIcon, AngleRightIcon } from 'theme/icons'

interface CardsSwiperProps {
	dataLength: number
}

const CardsSwiper: React.FC<CardsSwiperProps> = ({ dataLength, children }) => {
	const [swiper, setSwiper] = useState<any>(null)
	const [currentBreakpoint, setCurrentBreakpoint] = useState<null | {
		slidesPerView?: number | 'auto' | undefined
		spaceBetween?: number
	}>(null)

	const options = {
		spaceBetween: 32,
		slidesPerView: 1,
		loop: dataLength > 1,
		allowTouchMove: false,
		breakpoints: {
			1200: {
				slidesPerView: 4,
			},
			800: {
				slidesPerView: 3,
			},
			500: {
				slidesPerView: 2,
			},
			320: {
				slidesPerView: 1,
			},
		},
	}

	return (
		<StyledCardsSwiper>
			<Swiper
				{...options}
				onSwiper={swiper => setSwiper(swiper)}
				onBreakpoint={(swiper, breakpoint) => {
					setCurrentBreakpoint(breakpoint as any)
				}}
			>
				{children}
			</Swiper>
			{currentBreakpoint?.slidesPerView &&
				dataLength > currentBreakpoint.slidesPerView && (
					<>
						<StyledButtonWrapper direction='left'>
							<IconButton onClick={() => swiper?.slidePrev()}>
								<AngleLeftIcon fontSize='small' />
							</IconButton>
						</StyledButtonWrapper>
						<StyledButtonWrapper direction='right'>
							<IconButton onClick={() => swiper?.slideNext()}>
								<AngleRightIcon fontSize='small' />
							</IconButton>
						</StyledButtonWrapper>
					</>
				)}
		</StyledCardsSwiper>
	)
}

export default CardsSwiper
