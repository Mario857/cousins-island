import styled, { css } from 'styled-components';
import MuiLink from '@mui/material/Link';
import { palette } from 'theme/palette';

const getHoverColor = (color: string, underline: string) => {
  if (underline === 'none') {
    switch (color) {
      case 'text.secondary':
        return css`
          color: ${palette.alphaLight[800]};
        `;
      case 'primary':
        return css`
          color: ${palette.teal[50]};
        `;
      case 'text.primary':
      default:
        return css`
          color: ${palette.alphaLight[600]};
        `;
    }
  }
};

export const StyledTypographyLink = styled(MuiLink)`
  &:hover {
    ${(props) =>
      getHoverColor(props.color as string, props.underline as string)};
  }
` as typeof MuiLink;
