import { palette } from 'theme/palette';
import styled, { css } from 'styled-components';
import Backdrop from '@mui/material/Backdrop';

export const StyledSearch = styled.div<{ openOnMobile?: boolean }>`
  width: 100%;

  ${(props) => props.theme.breakpoints.down('md')} {
    ${(props) =>
      props.openOnMobile &&
      css`
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background: #1d2343;
        z-index: 999;
        padding: 16px;
      `};
  }
`;

export const StyledBackdrop = styled(Backdrop)`
  background: ${palette.alphaDark[500]};
  z-index: 4;
`;

export const StyledSearchResults = styled.div`
  margin-top: 8px;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 0;
    position: absolute;
    top: 55px;
    right: 0;
    left: 0;
    z-index: 5;
    background: ${palette.alphaLight[50]};
    border: 1px solid ${palette.alphaLight[200]};
    border-top: 0;
    border-radius: 0px 0px 6px 6px;
    backdrop-filter: blur(128px);
    padding: 8px;
  }
`;

export const StyledCollection = styled.div`
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background: ${palette.alphaLight[50]};
  }
`;

export const StyledArrowButton = styled.button`
  border: 0;
  background: transparent;
  margin-left: -4px;
  margin-right: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.palette.text.primary};
  cursor: pointer;
`;
