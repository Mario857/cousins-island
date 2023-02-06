import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledModalContainer = styled.div<{
  variant?: 'primary' | 'secondary';
  width?: number;
}>`
  position: absolute;
  background: #282c42;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.theme.breakpoints.down('md')} {
    padding-bottom: 62px;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${(props) => `${props.width}px`};
    border: 1px solid rgba(255, 255, 255, 0.18);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    min-height: auto;
    display: block;
  }
`;

export const StyledButtonClose = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  color: ${(props) =>
    props.disabled
      ? props.theme.palette.text.secondary
      : props.theme.palette.text.primary};
  transition: color 350ms;
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export const StyledHeader = styled.div`
  background: ${palette.alphaDark[300]};
  padding: 24px;
  border-top: 1px solid ${palette.alphaLight[200]};
  border-bottom: 1px solid ${palette.alphaLight[200]};
  margin-top: 24px;
`;
