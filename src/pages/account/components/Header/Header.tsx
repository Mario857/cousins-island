import React from 'react';
import Stack from '@mui/material/Stack';
import Heading from 'components/Heading/Heading';
import TerraAddress from '../TerraAddress/TerraAddress';

interface HeaderProps {
  heading: string;
}

const Header: React.FC<HeaderProps> = ({ heading }) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ md: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 4 }}
      spacing={{ xs: 4, md: 0 }}
    >
      <Heading variant="h800" component="h1">
        {heading}
      </Heading>
      <TerraAddress />
    </Stack>
  );
};

export default Header;
