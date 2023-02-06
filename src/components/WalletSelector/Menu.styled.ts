import styled from 'styled-components';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { palette } from 'theme/palette';

export const StyledMenu = styled(MuiMenu)`
  .MuiPaper-root {
    margin-top: 8px;
    background: #253165;
    backdrop-filter: blur(112px);
    border: 1px solid ${palette.alphaLight[200]};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16),
      0px 16px 24px -2px rgba(0, 0, 0, 0.32);
    border-radius: 6px;

    ${(props) => props.theme.breakpoints.down('md')} {
      width: 100%;
      margin-left: 2px;
    }
  }

  .MuiMenu-list {
    padding: 0;
  }

  .MuiList-root {
    padding: 0;
  }

  .MuiDivider-root {
    margin: 0;
  }

  .Mui-disabled {
    opacity: 1 !important;
  }

  .MuiMenuItem-divider {
    padding-bottom: 16px;
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 18px;
  }
`;

export const StyledMenuItem = styled(MuiMenuItem)`
  padding: 10px 16px !important;
  padding-bottom: ${(props) => (props.disabled ? 4 : 10)}!important;
  height: 40px;
  width: 100%;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;

  &:first-child {
    padding-top: 0;
  }
`;
