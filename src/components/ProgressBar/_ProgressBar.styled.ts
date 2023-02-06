import styled from 'styled-components';
import LinearProgress from '@mui/material/LinearProgress';

export const StyledProgressBar = styled(LinearProgress)`
  height: 8px;
  border-radius: 4px;
  border: 0;
  box-shadow: none;
  background: rgba(255, 255, 255, 0.18);

  .MuiLinearProgress-bar {
    border-radius: 4px;
    background: ${(props) => props.theme.palette.text.primary};
  }
`;
