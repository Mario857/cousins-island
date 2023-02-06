import styled from 'styled-components';

export const StyledButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    .MuiSvgIcon-fontSizeSmall {
      &:hover {
        color: ${(props) => props.theme.palette.text.secondary} !important;
      }
    }
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 16px;
  }
`;
