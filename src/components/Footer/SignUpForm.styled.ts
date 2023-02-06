import styled from 'styled-components';

export const StyledSignUpForm = styled.form`
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 0;
  }

  .MuiInput-root {
    width: 100%;
  }
  a {
    color: ${(props) => props.theme.palette.text.primary};
    text-decoration: underline;
    transition: color 350ms;
    &:hover {
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }

  .MuiButton-text {
    text-transform: none;
    padding: 0;
    &:hover {
      background: transparent;
      color: ${(props) => props.theme.palette.primary.light};
    }
  }
`;

export const StyledLoadingContainer = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
