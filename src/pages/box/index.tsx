import Layout from 'components/Layout/Layout';
import Grid from '@mui/material/Grid';
import * as ROUTES from 'constants/routes';
import BoxImage from './components/BoxImage';
import Information from './components/Information';
import BoxContent from './components/BoxContent';

const BoxPage = () => {
  const breadcrumbs = [
    {
      title: 'Homepage',
      href: ROUTES.HOME,
    },
    {
      title: 'Boxes',
      href: ROUTES.BOXES,
    },
    {
      title: 'The name of the chest',
    },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} container="secondary">
      <Grid container spacing={4} mb={8}>
        <Grid item xs={12} md={6}>
          <BoxImage />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '100%' }}>
          <Information />
        </Grid>
      </Grid>
      <BoxContent />
    </Layout>
  );
};

export default BoxPage;
