import styled from 'styled-components';

export const StyledArticleContainer = styled.div`
  padding: 32px 0;
  font-family: 'Libre Franklin', sans-serif;
  a {
    color: ${(props) => props.theme.palette.text.primary};
    transition: color 350ms;
    text-decoration: underline;
    &:hover {
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }
  h3 {
    font-size: 21px;
    margin-top: 50px;
  }
  ul {
    list-style-type: disc !important;
    margin-left: 16px !important;
  }
`;
