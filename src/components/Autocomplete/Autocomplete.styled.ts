import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { palette } from 'theme/palette';

export const StyledAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-input {
    &::placeholder {
      font-size: 16px;
    }
  }

  .MuiOutlinedInput-root {
    padding: 0 !important;
    height: 48px;
    font-size: 16px;
  }

  .MuiAutocomplete-clearIndicator {
    transition: color 350ms;

    &:hover {
      background: transparent;
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }

  input {
    padding: 12px 48px 12px 12px !important;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${palette.alphaLight[200]};
    background: ${palette.alphaLight[50]};
    font-size: 16px !important;
  }

  & .Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${palette.alphaLight[200]};
  }
`;

export const StyledTextField = styled(TextField)`
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${palette.alphaLight[200]};
  }
`;
