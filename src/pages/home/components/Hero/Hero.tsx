import Heading from 'components/Heading/Heading';
import {
  StyledHero,
  StyledLabel,
  StyledDescription,
  StyledSwiperWrapper,
  StyledSwiperArrowLeftWrapper,
  StyledSwiperArrowRightWrapper,
} from './Hero.styled';
import NFTCard from 'components/NFTCard/NFTCard';
import Box from '@mui/material/Box';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from 'components/Button/IconButton';
import { AngleLeftIcon, AngleRightIcon } from 'theme/icons';

const Hero = () => {
  const [swiper, setSwiper] = useState<any>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<null | {
    slidesPerView?: number | 'auto' | undefined;
    spaceBetween?: number;
  }>(null);

  const nfts = new Array(8).fill('');

  const params = {
    slidesPerView: 4,
    spaceBetween: 32,
    breakpoints: {
      1200: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 1,
      },
    },
  };

  return (
    <StyledHero>
      <Box sx={{ textAlign: 'center' }}>
        <StyledLabel>
          The First Gamified NFT Marketplace on the Terra Network
        </StyledLabel>
        <Heading
          variant="h900"
          component="h1"
          sx={{
            fontSize: { md: '89px !important' },
            lineHeight: { md: '133px !important' },
          }}
          mb={{ xs: 3, md: 1 }}
        >
          Discover NFTs today
        </Heading>
        <StyledDescription variant="h600" component="h3" mb={6}>
          Buy, Sell, Bid for NFTs on our marketplace and be rewarded with COUSIN
          Power
        </StyledDescription>
      </Box>
      {/* <StyledSwiperWrapper>
        {currentBreakpoint?.slidesPerView &&
          nfts.length > currentBreakpoint.slidesPerView && (
            <>
              <StyledSwiperArrowLeftWrapper onClick={() => swiper?.slidePrev()}>
                <IconButton>
                  <AngleLeftIcon fontSize="small" />
                </IconButton>
              </StyledSwiperArrowLeftWrapper>
              <StyledSwiperArrowRightWrapper
                onClick={() => swiper?.slideNext()}
              >
                <IconButton>
                  <AngleRightIcon fontSize="small" />
                </IconButton>
              </StyledSwiperArrowRightWrapper>
            </>
          )}
        <Swiper
          loop={true}
          onSwiper={(swiper) => setSwiper(swiper)}
          onBreakpoint={(swiper, breakpoint) => {
            setCurrentBreakpoint(breakpoint);
          }}
          {...params}
        >
          {nfts.map((nft, index) => (
            <SwiperSlide key={`hero-nft-${index}`}>
              <NFTCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledSwiperWrapper> */}
    </StyledHero>
  );
};

export default Hero;
