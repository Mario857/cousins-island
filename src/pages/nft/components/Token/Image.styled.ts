import styled from 'styled-components';

export const StyledImage = styled.img<{ loaded?: boolean }>`
  position: absolute;
  left: 50%;
  max-width: 100%;
  transform: translateX(-50%);
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)} !important;
`;

export const StyledImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 370px;
  overflow: hidden;

  ${(props) => props.theme.breakpoints.up('md')} {
    height: 570px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    min-height: 642px;
  }
`;

export const StyledImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.04);
`;
