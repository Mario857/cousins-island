import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Box from '@mui/material/Box';

const AccountLoader = () => {
  return (
    <Box mt={{ xs: 16, md: 32 }} display="flex" justifyContent="center">
      <LoadingSpinner size="large" color="secondary" />
    </Box>
  );
};

export default AccountLoader;
