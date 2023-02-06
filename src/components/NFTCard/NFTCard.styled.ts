import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledNFTCard = styled.div`
  position: relative;
  height: 100%;

  .MuiCard-root {
    transition: background 350ms;
    height: 100%;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  video {
    border-radius: 8px;
  }
`;

export const StyledTimeLeft = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: rgba(28, 36, 41, 0.72);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.palette.teal[200]};
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export const StyledLikeButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
`;
