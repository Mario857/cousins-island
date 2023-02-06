import styled from 'styled-components';

export const StyledAccordionOption = styled.div`
  height: 48px;
  position: relative;
  padding: 0px 17px 0px 16px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  user-select: ${(props) => (props.onClick ? 'none' : 'text')};

  div {
    width: 100%;
  }

  &:first-child {
    border-top: 0 !important;
  }

  border-top: 1px solid rgba(255, 255, 255, 0.11);
`;
