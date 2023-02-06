import styled, { css } from 'styled-components';

export interface StyledVideoTokenProps {
  size?: 'large' | 'medium' | 'small' | 'extra-small';
  borderRadius?: string;
}

export const StyledVideoToken = styled.div<StyledVideoTokenProps>`
  position: relative;
  border-radius: ${(props) => props.borderRadius || 'none'};
  overflow: hidden;
  width: 100%;

  ${(props) => {
    switch (props.size) {
      case 'large':
        return css`
          height: 292px;

          ${props.theme.breakpoints.up('md')} {
            height: 560px;
          }

          ${props.theme.breakpoints.up('xl')} {
            height: 594px;
          }
        `;
      case 'small':
        return css`
          width: 110px;
          height: 110px;
        `;
      case 'extra-small':
        return css`
          width: 64px;
          height: 64px;
        `;
      case 'medium':
      default:
        return css`
          height: 256px;
        `;
    }
  }}

  video {
    width: 100%;
    height: 100%;
  }
`;
