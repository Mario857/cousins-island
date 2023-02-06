import Heading from 'components/Heading/Heading';
import Layout from 'components/Layout/Layout';
import * as ROUTES from 'constants/routes';
import Collections from 'components/Collections/Collections';
import { State } from 'store/store';
import { useSelector } from 'react-redux';
import AppleIcon from 'components/AppleIcon/AppleIcon';
import Grid from '@mui/material/Grid';
import Select from 'components/Select/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import ScrollUpButton from 'components/ScrollUpButton/ScrollUpButton';
import Box from '@mui/material/Box';

const sortOptions = [
  {
    label: 'All collections',
    value: 'collections',
  },
  {
    label: 'Newest',
    value: 'newestCollections',
  },
  {
    label: 'Oldest',
    value: 'oldestCollections',
  },
  {
    label: 'Trending',
    value: 'trendingCollections',
  },
];

const CollectionsPage = () => {
  const {
    collections,
    newestCollections,
    oldestCollections,
    trendingCollections,
    collectionsLoaders,
  } = useSelector((state: State) => state.collections);

  const allCollections = {
    collections,
    newestCollections,
    trendingCollections,
    oldestCollections,
  };

  const [sortBy, setSortBy] = useState('collections');

  const breadcrumbs = [
    {
      title: 'Homepage',
      href: ROUTES.HOME,
    },
    {
      title: 'Collections',
    },
  ];

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      loading={collectionsLoaders?.getCollections}
    >
      <Grid container spacing={4} alignItems="center" mb={4}>
        <Grid item xs={12} md={9}>
          <Heading
            variant="h800"
            component="h3"
            sx={{
              fontSize: { md: '56px !important' },
              lineHeight: { md: '84px !important' },
            }}
          >
            <AppleIcon
              size="large"
              icon="earth-globe-americas"
              alt="Earth Globe Americas"
            />{' '}
            All collections
          </Heading>
        </Grid>
        <Grid item xs={12} md={3}>
          <Select
            value={sortBy}
            fullWidth
            onChange={(e) => setSortBy(e.target.value as string)}
          >
            {sortOptions.map((option) => (
              <MenuItem
                value={option.value}
                key={`collections-sort-by-${option.value}`}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Collections
        collections={allCollections?.[sortBy as keyof typeof allCollections]}
        display="grid"
      />
      <Box display={{ xs: 'block', md: 'none' }}>
        <ScrollUpButton />
      </Box>
    </Layout>
  );
};

export default CollectionsPage;
