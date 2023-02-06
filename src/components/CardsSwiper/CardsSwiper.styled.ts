import styled from 'styled-components';

export const StyledButtonWrapper = styled.div<{
  direction: 'left' | 'right';
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 55;
  left: ${(props) => (props.direction === 'left' ? '-20px' : 'auto')};
  right: ${(props) => (props.direction === 'right' ? '-20px' : 'auto')};

  ${(props) => props.theme.breakpoints.up('md')} {
    left: ${(props) => (props.direction === 'left' ? '-20px' : 'auto')};
    right: ${(props) => (props.direction === 'right' ? '-20px' : 'auto')};
  }
`;

export const StyledCardsSwiper = styled.div`
  position: relative;

  .swiper-slide {
    height: auto;
  }
`;
