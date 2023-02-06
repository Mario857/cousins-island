import styled from 'styled-components';
import MuiInput from '@mui/material/Input';
import { palette } from 'theme/palette';

export const StyledInput = styled(MuiInput)`
  height: ${(props) => (props.size === 'small' ? '40px' : '48px')};
  padding: 12px 16px;
  background: ${palette.alphaLight[50]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 6px;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 16px;
  box-sizing: border-box;
  display: flex;
  transition: background 350ms;
  cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'auto')};

  input {
    padding: 0;

    cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'auto')};

    &::placeholder {
      opacity: 1;
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }

  .MuiButton-textPrimary {
    &:hover {
      color: ${(props) => props.theme.palette.primary.light};
    }
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 20px;
    margin-right: 10px;
  }

  .MuiButton-text {
    margin-top: -2px;
    text-transform: none;
    padding: 0;
    font-family: 'Inter', sans-serif;

    &:hover {
      background: transparent;
    }
  }
`;
