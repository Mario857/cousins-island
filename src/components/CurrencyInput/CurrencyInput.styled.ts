import styled from 'styled-components';
import { palette } from 'theme/palette';

export const StyledCurrencyInputWrapper = styled.div<{ readOnly?: boolean }>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'auto')};

  .MuiInput-root {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
    width: 100%;
  }
`;

export const StyledCurrency = styled.div`
  padding: 16px;
  border: 1px solid ${palette.alphaLight[200]};
  background: ${palette.alphaLight[100]};
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 0px 0px 6px;

  span {
    text-transform: uppercase;
  }
`;

export const StyledAvailableButton = styled.button`
  background: transparent;
  padding: 0;
  border: 0;
  color: ${(props) => props.theme.palette.text.secondary};
  text-decoration: underline;
  transition: color 350ms;
  font-family: 'Libre Franklin', sans-serif;
  margin: 3px 0;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.palette.text.primary};
  }
  &:disabled {
    &:hover {
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }
  &:focus {
    outline: none;
  }
`;
