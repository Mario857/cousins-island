import styled from 'styled-components';

export const StyledOptionsAccordionWrapper = styled.div`
  background: transparent;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;

  .MuiRadio-root {
    span {
      margin: 0;
    }
  }

  .MuiInputBase-root {
    width: 100%;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.18);
    border-radius: 3px;
    &:hover {
      background: rgba(255, 255, 255, 0.32);
    }
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    max-height: none;
    overflow-y: auto;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    max-height: 500px;
    overflow-y: auto;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    max-height: 600px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    max-height: 700px;
  }
`;
