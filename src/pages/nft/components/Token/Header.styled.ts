import styled from 'styled-components';
import Button from '@mui/material/Button';

export const StyledExpandButton = styled(Button)`
  color: ${(props) =>
    props.disabled
      ? 'rgba(255,255,255,0.3)'
      : props.theme.palette.text.primary};
  text-transform: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  padding: 0;

  &:hover {
    color: ${(props) =>
      props.disabled
        ? 'rgba(255,255,255,0.3)'
        : props.theme.palette.text.secondary} !important;
    background: transparent;
  }

  .MuiDialog-container {
    background: red;
  }
`;
