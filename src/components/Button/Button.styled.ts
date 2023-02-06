import { Theme } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { palette } from 'theme/palette';
import styled, { css } from 'styled-components';
import MuiLoadingButton from '@mui/lab/LoadingButton';

const getButtonPropertiesBySize = (size: string | undefined) => {
  switch (size) {
    case 'small':
      return css`
        padding: 8px 12px;
        height: 32px;
        font-size: 12px;
      `;
    case 'medium':
      return css`
        font-size: 14px;
        font-weight: 600;
        padding: 10px 20px;
        height: 40px;
        ${(props) => props.theme.breakpoints.up('md')} {
          padding: 10px 20px;
          height: 40px;
          font-size: 14px;
        }
      `;
    case 'large':
      return css`
        padding: 12px 24px;
        height: 48px;
        font-size: 16px;
        font-weight: 600;
      `;
    default:
      return css`
        padding: 12px 24px;
        height: 48px;
        font-size: 16px;
      `;
  }
};

const getButtonPropertiesByColor = (color: string | undefined) => {
  switch (color) {
    case 'tertiary':
      return css`
        color: rgba(255, 255, 255, 0.88) !important;
        border: 1px solid rgba(255, 255, 255, 0.18);
      `;
    case 'success':
      return css`
        background: #1d442e;
        color: #159d50;
        opacity: 1;
      `;
    case 'primary':
      return css`
        color: ${palette.alphaDark[700]} !important;
      `;
    case 'secondary':
      return css`
        color: ${palette.teal[200]} !important;
      `;
    case 'dark':
      return css`
        color: rgba(255, 255, 255, 0.88) !important;
        border: 1px solid rgba(255, 255, 255, 0.18);
      `;
    case 'light':
      return css`
        color: #212121 !important;
      `;
    default:
      return css`
        color: ${palette.alphaDark[700]} !important;
      `;
  }
};

export const StyledButton = styled(MuiLoadingButton)`
  border-radius: 6px;
  box-shadow: none;
  text-transform: none;
  background: ${(props) => props.theme.palette[props.color || 'primary'].main};
  font-weight: 600;
  font-family: 'Inter', sans-serif;

  ${(props) =>
    props.color === 'dark' &&
    css`
      border: 1px solid rgba(255, 255, 255, 0.11);
    `}
  ${(props) => getButtonPropertiesBySize(props.size)}
  ${(props) => getButtonPropertiesByColor(props.color)}
  .MuiLoadingButton-loadingIndicator {
    position: relative;
    left: auto;
  }
  a {
    text-decoration: none;
    ${(props) => getButtonPropertiesByColor(props.color)}
  }
  &:hover {
    box-shadow: none;
    background: ${(props) =>
      props.theme.palette[props.color || 'primary'].light};
  }
  &:disabled {
    opacity: 0.5;
    background: ${(props) =>
      props.theme.palette[props.color || 'primary'].light};
    ${(props) => getButtonPropertiesByColor(props.color)}
    ${(props) =>
      props.loading &&
      css`
        opacity: 1;
        color: transparent;
      `}
  }
`;

const getTextButtonPropertiesByColor = (
  color: string | undefined,
  theme: Theme
) => {
  switch (color) {
    case 'primary':
      return css`
        color: ${theme.palette.primary.main};
        &:hover {
          color: ${theme.palette.primary.light};
        }
      `;
    case 'light':
      return css`
        color: ${theme.palette.text.secondary};
        &:hover {
          color: ${theme.palette.text.primary};
        }
      `;
    default:
      return css`
        color: ${theme.palette.primary.main};
        &:hover {
          color: ${theme.palette.primary.light};
        }
      `;
  }
};

export const StyledTextButton = styled(MuiButton)`
  font-weight: 600;
  text-transform: none;
  ${(props) => getTextButtonPropertiesByColor(props.color, props.theme)}
  padding: 0;
  font-size: 14px;
  height: 20px;
  transition: color 350ms;
  background: transparent;
  min-width: auto;
  &:hover {
    background: transparent;
  }
`;
