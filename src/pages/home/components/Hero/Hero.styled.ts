import styled from 'styled-components';
import MuiTypography from '@mui/material/Typography';
import MuiContainer from '@mui/material/Container';

export const StyledLabel = styled.p`
  font-family: 'Inter', sans-serif;
  display: block;
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: 600;
  background: linear-gradient(
    51.06deg,
    #b5caef 0.87%,
    #b5caef 25.96%,
    #bac5ee 49.23%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StyledDescription = styled(MuiTypography)`
  ${(props) => props.theme.breakpoints.up('md')} {
    font-size: 40px;
    line-height: 52px;
    font-weight: 600;
  }

  max-width: 880px;
  margin-left: auto;
  margin-right: auto;

  background: linear-gradient(
    51.06deg,
    #88a7fe 0.87%,
    #99bfff 25.96%,
    #94e1ff 49.23%,
    #94e1ff 74.93%,
    #94e1ff 97.48%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
` as typeof MuiTypography;

export const StyledHero = styled.div`
  padding-top: 24px;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding-top: 82px;
  }

  .MuiCard-root {
    backdrop-filter: blur(1px);
  }
`;

export const StyledContainer = styled(MuiContainer)`
  max-width: 1122px;
  padding: 0;
`;

export const StyledSwiperWrapper = styled.div`
  position: relative;

  .swiper-container {
    overflow: visible;
  }
`;

export const StyledSwiperArrowLeftWrapper = styled.div`
  position: absolute;
  top: -92px;
  left: 0;
`;

export const StyledSwiperArrowRightWrapper = styled.div`
  position: absolute;
  top: -92px;
  right: 0;
`;
