import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import Fade from '@mui/material/Fade';

const EmptyList = () => {
  return (
    <Fade in={true}>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h600" sx={{ color: 'text.primary', mb: 1 }} component="h3">
          No items found
        </Typography>
        <Typography variant="h400" sx={{ color: 'text.secondary', mb: 4 }} component="h5">
          Come back soon! Or try to browse <br />
          something for you on our marketplace
        </Typography>
        <Link to={ROUTES.HOME}>
          <Button variant="contained" color="primary" type="button">
            Browse marketplace
          </Button>
        </Link>
      </Box>
    </Fade>
  );
};

export default EmptyList;
