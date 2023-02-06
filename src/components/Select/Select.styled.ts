import styled from 'styled-components';
import MuiSelect from '@mui/material/Select';

export const StyledSelect = styled(MuiSelect)`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  font-size: 16px;
  height: 48px;

  fieldset {
    border: 1px solid rgba(255, 255, 255, 0.11) !important;
  }

  .MuiSelect-select {
    padding-left: 16px;
    padding-top: 14px;
    padding-bottom: 12px;
    padding-right: 50px !important;
  }

  .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgba(255, 255, 255, 0.11);
  }

  .MuiSvgIcon-root {
    margin-right: 10px !important;
    margin-top: 2px;
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 19px;
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255, 255, 255, 0.11);
  }
` as typeof MuiSelect;
