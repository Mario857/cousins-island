import SocialLinks from './SocialLinks';
import Grid from '@mui/material/Grid';

const SecondaryFooter = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={6} lg={7}>
        <SocialLinks />
      </Grid>
      {/* <Grid item xs={12} md={6} lg={5}>
        <ExternalLinks />
      </Grid> */}
    </Grid>
  );
};

export default SecondaryFooter;
