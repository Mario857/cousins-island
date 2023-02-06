import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import AppleIcon from 'components/AppleIcon/AppleIcon';
import TextButton from 'components/Button/TextButton';
import { ArrowRightIcon } from 'theme/icons';
import { State } from 'store/store';
import { useSelector } from 'react-redux';
import Collections from 'components/Collections/Collections';
import Box from '@mui/material/Box';
import Heading from 'components/Heading/Heading';

const NewestCollections = () => {
  const { newestCollections } = useSelector(
    (state: State) => state.collections
  );

  return (
    <Box mt={{ xs: 10, md: 16 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={{ xs: 3, md: 6 }}
      >
        <Heading
          variant="h600"
          component="h2"
          color="text.primary"
          sx={{
            fontSize: { md: '56px !important' },
            lineHeight: { md: '84px !important' },
          }}
          mb={{ xs: 1, md: 0 }}
        >
          <AppleIcon size="large" icon="glowing-star" alt="Glowing Star" />{' '}
          Newest Arrivals
        </Heading>
        <Link to={ROUTES.COLLECTIONS}>
          <TextButton
            color="primary"
            size="large"
            endIcon={<ArrowRightIcon fontSize="small" />}
          >
            View all collections
          </TextButton>
        </Link>
      </Stack>
      {newestCollections && (
        <Collections collections={newestCollections} display="carousel" />
      )}
    </Box>
  );
};

export default NewestCollections;
