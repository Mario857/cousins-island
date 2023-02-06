import styled from 'styled-components';

export const StyledFooter = styled.footer`
  background: rgba(255, 255, 255, 0.04);
  padding: 50px 16px;
  color: ${(props) => props.theme.palette.text.primary};
  font-family: 'Inter', sans-serif;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 68px 0;
    backdrop-filter: blur(32px);
  }

  .MuiGrid-grid-md-8 {
    ${(props) => props.theme.breakpoints.up('md')} {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  span {
    font-size: 14px;
  }

  .MuiBox-root {
    margin-bottom: 0 !important;
  }
`;

export const StyledLogo = styled.img`
  width: 32px;
`;

export const StyledLinks = styled.ul`
  li {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: ${(props) => props.theme.palette.text.primary};
    text-decoration: none;
    transition: color 350ms;
    font-size: 14px;
    &:hover {
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }
`;

export const StyledLink = styled.a`
  color: ${(props) => props.theme.palette.text.primary};
  text-decoration: underline;
  transition: color 350ms;
  &:hover {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export const StyledBottomLinks = styled.ul`
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.up('md')} {
    text-align: right;
    margin-bottom: 0;
  }

  li {
    display: block;
    margin-bottom: 16px;
    ${(props) => props.theme.breakpoints.up('md')} {
      display: inline-block;
      margin-left: 32px;
      margin-bottom: 0;
    }
  }

  a {
    font-size: 14px;
    color: ${(props) => props.theme.palette.text.secondary};
    transition: color 350ms;
    &:hover {
      color: ${(props) => props.theme.palette.text.primary};
    }
  }
`;

export const StyledHeading = styled.h5`
  position: relative;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.primary};
  margin: 0;
  margin-bottom: 8px;
  line-height: 28px;

  ${(props) => props.theme.breakpoints.up('md')} {
    font-size: 16px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 18px;
  }

  &:before {
    content: '';
    position: absolute;
    width: 1px;
    height: 16px;
    background: ${(props) => props.theme.palette.primary.main};
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
  }
`;
