import styled from 'styled-components';
import MuiAppBar from '@mui/material/AppBar';
import MuiContainer from '@mui/material/Container';

export const StyledAppBar = styled(MuiAppBar)`
  min-height: 70px;
  background: #22243d;
  box-shadow: inset 0px -1px 0px rgba(255, 255, 255, 0.13);
  display: flex;
  justify-content: center;
  padding: 16px 0;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0;
  }

  .MuiToolbar-root {
    min-height: auto;
    padding: 0;
    margin-bottom: 16px;

    ${(props) => props.theme.breakpoints.up('md')} {
      margin-bottom: 0;
    }
  }
`;

export const StyledLogo = styled.img`
  width: 82px;
  margin-top: 2px;

  @media screen and (max-width: 1399px) and (min-width: 1011px) {
    width: 40px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    width: 108px;
    height: 42px;
  }
`;

export const StyledContainer = styled(MuiContainer)`
  max-width: 1352px;
  padding: 0 16px;
  position: relative;
`;

export const StyledNavContainer = styled.div<{ open?: boolean }>`
  position: absolute;
  top: 128px;
  width: 100vw;
  min-height: calc(100vh - 128px);
  left: -16px;
  background: #1d2343;
  z-index: 3;
  padding: 24px 32px 92px 32px;
  display: ${(props) => (props.open ? 'flex' : 'none')};
  overflow-y: auto;
  flex-direction: column;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.up('md')} {
    position: relative;
    padding: 0;
    background: transparent;
    top: auto;
    left: auto;
    z-index: 1;
    position: relative;
    width: auto;
    min-height: auto;
    display: block;
  }
`;

export const StyledNav = styled.ul`
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    align-items: center;
  }
`;

export const StyledNavLink = styled.li<{
  active?: boolean;
  disabled?: boolean;
}>`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    margin-right: 22px;
  }

  a {
    font-family: 'Inter', sans-serif;
    transition: color 350ms;
    font-size: 22px;
    font-weight: 700;
    line-height: 34px;
    color: ${(props) =>
      props.active
        ? props.theme.palette.text.primary
        : props.theme.palette.text.secondary};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

    ${(props) => props.theme.breakpoints.up('md')} {
      font-size: 11px;
      font-weight: 600;
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      font-size: 14px;
      font-weight: 600;
    }

    &:hover {
      color: ${(props) =>
        props.disabled
          ? props.theme.palette.text.secondary
          : props.theme.palette.text.primary};
    }
  }
`;

export const StyledIconButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  color: ${(props) => props.theme.palette.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;

  ${(props) => props.theme.breakpoints.up('md')} {
    display: none;
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 20px;
  }
`;
