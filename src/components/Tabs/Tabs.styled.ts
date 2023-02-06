import styled from 'styled-components';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import { palette } from 'theme/palette';

export const StyledTabs = styled(MuiTabs)`
  .Mui-selected {
    color: rgba(255, 255, 255, 0.88);
  }
`;

export const StyledTab = styled(MuiTab)`
  background-color: transparent;
  color: ${(props) => props.theme.palette.text.secondary};
  text-transform: none;
  font-weight: 400;
  border-bottom: 1px solid ${palette.alphaLight[200]};
  padding: 0 !important;
  opacity: 1;
  transition: color 350ms;
  font-family: 'Libre Franklin', sans-serif;

  @media screen and (max-width: 1214px) {
    min-width: 60px;
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 14px;
  }

  &:disabled {
    &:hover {
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }

  &:hover {
    color: ${(props) => props.theme.palette.text.primary};
  }
`;
