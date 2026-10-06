import styled, { css } from 'styled-components';
import MuiButton from '@mui/material/Button';
import { PaletteColor, Theme } from '@mui/material';

// Custom colors (light, dark, tertiary) are added to the palette in theme/theme.ts.
const getPaletteColor = (theme: Theme, color: string | undefined) =>
  (theme.palette as unknown as Record<string, PaletteColor>)[color || 'primary'];

const stylesBySize = {
  small: css`
    font-size: 12px;
  `,
  medium: css`
    font-size: 14px;
  `,
  large: css`
    font-size: 16px;
  `,
};

export const StyledTextButton = styled(MuiButton)`
  padding: 0;
  color: ${(props) => getPaletteColor(props.theme, props.color).main};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  min-width: auto;
  text-align: left;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  ${(props) => stylesBySize[props.size || 'medium']}

  &:disabled {
    color: ${(props) => getPaletteColor(props.theme, props.color).main};
  }

  &:hover {
    background: transparent;
    color: ${(props) =>
      props.disabled
        ? getPaletteColor(props.theme, props.color).main
        : getPaletteColor(props.theme, props.color).light};
  }
`;
