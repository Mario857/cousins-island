import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledContainer = styled.div`
  background: #212341;
  min-height: 100vh;
`;

export const StyledHeader = styled.div`
  height: 56px;
  background: #16182c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${palette.alphaLight[200]};
  position: relative;
  position: sticky;
  top: 0;
  z-index: 5;

  button {
    cursor: pointer;
    background: transparent;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    color: ${(props) => props.theme.palette.text.primary};
    position: absolute;
    top: calc(50% + 2px);
    transform: translateY(-50%);
    left: 16px;
  }
`;
