import styled from 'styled-components';

export const StyledDescriptionWrapper = styled.div`
  margin-bottom: 16px;

  ${(props) => props.theme.breakpoints.up('md')} {
    max-width: 450px;
    margin: 0 auto;
    margin-bottom: 32px;
  }
`;
