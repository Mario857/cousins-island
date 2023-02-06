import styled from 'styled-components';
import TableRow from '@mui/material/TableRow';
import { palette } from 'theme/palette';

export const StyledBidRow = styled(TableRow)`
  .MuiTableCell-root {
    border-bottom: 1px solid ${palette.alphaLight[200]};
    padding: 24px;
    white-space: nowrap;
  }

  &:last-child {
    .MuiTableCell-root {
      border-bottom: 0;
    }
  }
`;
