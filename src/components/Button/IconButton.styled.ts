import styled from 'styled-components';
import MuiIconButton from '@mui/material/IconButton';

export const StyledIconButton = styled(MuiIconButton)`
  width: 40px;
  height: 40px;
  background: #2a3155;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: ${(props) => props.theme.palette.text.primary};
  border-radius: 50%;

  .MuiSvgIcon-fontSizeSmall {
    font-size: 20px;
  }

  // ${(props) => props.theme.breakpoints.up('md')} {
  //   width: 48px;
  //   height: 48px;
  //   border-radius: 6px;
  // }

  &:hover {
    background: #2a3155;

    ${(props) => props.theme.breakpoints.up('md')} {
      background: #262c4a;
    }
  }
`;
