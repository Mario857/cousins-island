import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledAbout = styled.div`
  .MuiTabs-root {
    border-bottom: 1px solid ${palette.alphaLight[200]};
    background: ${palette.alphaDark[300]};
  }

  .MuiTab-root {
    border: 0;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
  }
`;

export const StyledContent = styled.div`
  background: ${palette.alphaLight[50]};
`;
