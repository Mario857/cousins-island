import { palette } from 'theme/palette';
import styled from 'styled-components';
import MuiMenu from '@mui/material/Menu';

export const StyledNotificationsDesktop = styled.div`
  max-height: 395px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.alphaLight[200]};
    border-radius: 8px;

    &:hover {
      background: ${palette.alphaLight[400]};
    }
  }
`;

export const StyledContainer = styled.div`
  position: relative;
  z-index: 1301 !important;
`;

export const StyledMenu = styled(MuiMenu)`
  top: 16px;
  border-radius: 6px;
  background: transparent;

  .MuiList-root {
    padding: 24px;
    width: 100% !important;
    border-radius: 6px;
    background: #2e3152;
    box-shadow: 0px 6px 20px -2px rgba(25, 25, 26, 0.4),
      0px 4px 6px rgba(25, 25, 26, 0.4);
    border: 1px solid ${palette.alphaLight[200]};
    backdrop-filter: blur(128px);

    ${(props) => props.theme.breakpoints.up('md')} {
      max-width: 512px;
    }
  }
`;

export const StyledLine = styled.div`
  margin: 24px 0;
  width: 100%;
  height: 1px;
  background: ${palette.alphaLight[200]};
`;
