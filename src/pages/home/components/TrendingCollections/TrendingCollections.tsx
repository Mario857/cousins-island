import AppleIcon from 'components/AppleIcon/AppleIcon';
import { State } from 'store/store';
import { useSelector } from 'react-redux';
import Collections from 'components/Collections/Collections';
import Box from '@mui/material/Box';
import Heading from 'components/Heading/Heading';

const TrendingCollections = () => {
  const { trendingCollections } = useSelector(
    (state: State) => state.collections
  );

  return (
    <Box mt={{ xs: 8, md: 16 }}>
      <Heading
        variant="h600"
        component="h2"
        color="text.primary"
        sx={{
          fontSize: { md: '56px !important' },
          lineHeight: { md: '84px !important' },
        }}
        mb={{ xs: 3, md: 6 }}
      >
        <AppleIcon
          size="large"
          icon="chart-increasing"
          alt="Chart increasing"
        />{' '}
        Trending
      </Heading>
      {trendingCollections && (
        <Collections collections={trendingCollections} display="carousel" />
      )}
    </Box>
  );
};

export default TrendingCollections;
