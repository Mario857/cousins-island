import styled from 'styled-components';

export const StyledContent = styled.div`
  min-height: 550px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 16px 16px 0px 0px;
  padding: 24px 16px 36px;
  background: #282c42;

  &:focus-visible {
    outline: none !important;
  }
`;

export const StyledCloseButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  color: ${(props) => props.theme.palette.text.primary};
`;
