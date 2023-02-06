import styled from 'styled-components';
import Button from '@mui/material/Button';
import { palette } from 'theme/palette';

export const StyledImageWrapper = styled.div`
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  z-index: 10000;
  max-height: 800px;

  img {
    width: 100%;
    max-height: 700px;
  }
`;

export const StyledCloseButton = styled(Button)`
  padding: ${(props) => (props.startIcon ? '12px 24px' : 0)};
  height: 40px;
  min-width: 40px;
  border: 1px solid ${palette.alphaLight[200]};
  background: ${palette.alphaDark[300]};
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 6px;
  backdrop-filter: blur(100px);
  text-transform: none;
  color: ${(props) => props.theme.palette.text.primary};

  ${(props) => props.theme.breakpoints.up('md')} {
    height: 48px;
    min-width: 48px;
  }

  &:hover {
    background: ${palette.alphaDark[300]};

    ${(props) => props.theme.breakpoints.up('md')} {
      background: ${palette.alphaDark[500]};
    }
  }

  .MuiSvgIcon-fontSizeMedium {
    font-size: 20px;

    ${(props) => props.theme.breakpoints.up('md')} {
      font-size: 24px;
    }
  }
`;

export const StyledDescriptionContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 56px;
  width: 100%;
  backdrop-filter: blur(32px);
  background: rgba(0, 0, 0, 0.08);
  padding: 16px;
  text-align: center;
`;
