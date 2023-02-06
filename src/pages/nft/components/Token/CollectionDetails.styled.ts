import styled from 'styled-components';

export const StyledDescription = styled.div`
  ul {
    list-style-type: disc;

    li {
      margin-bottom: 16px;
      margin-left: 18px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;
