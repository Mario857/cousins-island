import React from 'react';
import Card from 'components/Card/Card';
import Header from './Header';
import Image from './Image';
import CollectionDetails from './CollectionDetails';
import Box from '@mui/material/Box';

interface TokenProps {
  previousQuery: string;
  isVideo: boolean;
}

const Token: React.FC<TokenProps> = ({ previousQuery, isVideo = false }) => {
  return (
    <Card sx={{ p: 0, mb: { xs: 4, md: 0 } }}>
      <Header />
      <Image isVideo={isVideo} />
      <Box display={{ xs: 'none', md: 'block' }}>
        <CollectionDetails previousQuery={previousQuery} />
      </Box>
    </Card>
  );
};

export default Token;
