import styled from 'styled-components';
import MuiMenuItem from '@mui/material/MenuItem';
import { palette } from 'theme/palette';

export const StyledMenuItem = styled(MuiMenuItem)`
  padding: 10px 16px;
  border-bottom: 1px solid ${palette.alphaLight[200]};
  font-size: 14px;

  &:last-child {
    border-bottom: 0;
  }

  .MuiListItemText-primary {
    font-size: 14px;
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 20px;
  }
`;
