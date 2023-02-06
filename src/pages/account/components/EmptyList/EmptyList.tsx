import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import Fade from '@mui/material/Fade';

const EmptyList = () => {
  return (
    <Fade in={true}>
      <Box mt={8} textAlign="center">
        <Typography variant="h600" color="text.primary" component="h3" mb={1}>
          No items found
        </Typography>
        <Typography variant="h400" color="text.secondary" component="h5" mb={4}>
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
