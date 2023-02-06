import styled from 'styled-components';

export const StyledSocialLinks = styled.ul`
  text-align: center;

  ${(props) => props.theme.breakpoints.up('md')} {
    text-align: left;
  }

  li {
    display: inline-block;
    margin: 0 16px;

    ${(props) => props.theme.breakpoints.up('md')} {
      margin-right: 32px;
      margin-left: 0;
    }
  }

  a {
    color: ${(props) => props.theme.palette.text.secondary};
    transition: color 350ms;

    &:hover {
      color: ${(props) => props.theme.palette.text.primary};
    }
  }
`;

export const StyledExternalLinks = styled.ul`
  text-align: center;
  margin-top: 16px;

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 0;
    text-align: right;
  }

  li {
    display: inline-block;

    margin: 0 8px;
    margin-bottom: 8px;

    ${(props) => props.theme.breakpoints.up('md')} {
      margin-right: 32px;
      margin-left: 0;
      margin-bottom: 0;

      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

export const StyledLink = styled.a<{ disabled?: boolean }>`
  color: ${(props) => props.theme.palette.text.secondary};
  transition: color 350ms;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  ${(props) => props.theme.breakpoints.up('md')} {
    color: ${(props) => props.theme.palette.text.primary};
  }

  &:hover {
    color: ${(props) =>
      props.disabled
        ? props.theme.palette.text.primary
        : props.theme.palette.text.secondary};
  }
`;
