import styled from 'styled-components';
import { palette } from 'theme/palette';

export const StyledNotificationsBell = styled.button<{
  open?: boolean;
  dot?: boolean;
}>`
  background: transparent;
  border: 0;
  padding: 0;
  color: ${(props) =>
    props.open
      ? props.theme.palette.text.primary
      : props.theme.palette.text.secondary};
  transition: color 350ms;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: ${palette.red[200]};
    border-radius: 50%;
    top: 0;
    right: 0;
    display: ${(props) => (props.dot ? 'block' : 'none')};
  }

  &:hover {
    color: ${(props) => props.theme.palette.text.primary};
  }

  &:focus {
    outline: none;
  }
`;
