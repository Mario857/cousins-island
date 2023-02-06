import styled from 'styled-components';
import MuiContainer from '@mui/material/Container';

export const StyledContainer = styled(MuiContainer)`
  padding: 0 16px;
  position: relative;
  max-width: 1200px;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0 16px;
  }

  ${(props) => props.theme.breakpoints.up('xl')} {
    max-width: 1352px;
  }
`;
