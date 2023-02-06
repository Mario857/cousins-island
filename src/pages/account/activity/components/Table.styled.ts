import styled from 'styled-components';
import MuiTableContainer from '@mui/material/TableContainer';
import { palette } from 'theme/palette';

export const StyledTableContainer = styled(MuiTableContainer)`
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 8px;
  background: ${palette.alphaLight[50]};
`;
