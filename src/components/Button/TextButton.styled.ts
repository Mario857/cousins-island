import styled, { css } from 'styled-components';
import MuiButton from '@mui/material/Button';

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
  color: ${(props) => props.theme.palette[props.color || 'primary'].main};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  min-width: auto;
  text-align: left;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  ${(props) => stylesBySize[props.size || 'medium']}

  &:disabled {
    color: ${(props) => props.theme.palette[props.color || 'primary'].main};
  }

  &:hover {
    background: transparent;
    color: ${(props) =>
      props.disabled
        ? props.theme.palette[props.color || 'primary']
        : props.theme.palette[props.color || 'primary'].light};
  }
`;
