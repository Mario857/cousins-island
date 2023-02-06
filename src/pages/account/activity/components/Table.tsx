import React from 'react';
import Box from '@mui/material/Box';
import Heading from 'components/Heading/Heading';
import { StyledTableContainer } from './Table.styled';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import TextButton from 'components/Button/TextButton';
import { ArrowRightIcon } from 'theme/icons';
import { useHistory } from 'react-router-dom';

interface TableProps {
  heading: string;
  to?: string;
}

const Table: React.FC<TableProps> = ({ heading, to, children }) => {
  const history = useHistory();

  return (
    <Box mb={6}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={{ xs: 2, md: 1 }}
      >
        <Heading variant="h600" component="h4">
          {heading}
        </Heading>
        {to && (
          <TextButton
            color="primary"
            endIcon={<ArrowRightIcon />}
            onClick={() => history.push(to)}
          >
            View all
          </TextButton>
        )}
      </Stack>
      <StyledTableContainer>
        <MuiTable>
          <TableBody>{children}</TableBody>
        </MuiTable>
      </StyledTableContainer>
    </Box>
  );
};

export default Table;
