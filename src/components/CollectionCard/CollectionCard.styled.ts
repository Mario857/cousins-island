import styled from 'styled-components';
import MuiCard from '@mui/material/Card';
import { palette } from 'theme/palette';

export const StyledCard = styled(MuiCard)`
  border: 1px solid ${palette.alphaLight[100]} !important;
  background: ${palette.alphaLight[50]};
  position: relative;
  border-radius: 8px;
  box-shadow: none;
  height: 100%;
  transition: background 350ms !important;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .MuiCardContent-root {
    position: relative;
    padding: 24px;
  }

  .MuiCardMedia-root {
    border-radius: 0;
  }
`;

export const StyledBannerPlaceholder = styled.div`
  height: 152px;
  background: ${palette.alphaLight[100]};
  border-bottom: 1px solid ${palette.alphaLight[100]};
`;

export const StyledLogoContainer = styled.div`
  position: absolute;
  top: -50px;
`;
