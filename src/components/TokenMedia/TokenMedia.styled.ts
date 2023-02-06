import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledImageWrapper = styled.div<{ width: string; height: string, borderRadius: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: relative;
  overflow: hidden;
  border-radius: ${props => props.borderRadius};
`;

export const StyledImage = styled.img<{ loaded?: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)} !important;
`;

export const StyledImagePlaceholder = styled.div<{ borderRadius: string }>`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: ${props => props.borderRadius};
  background: ${palette.alphaLight[100]};
`;
