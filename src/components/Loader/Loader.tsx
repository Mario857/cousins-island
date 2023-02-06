import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { StyledLoader } from './Loader.styled';

const Loader = () => {
  return (
    <StyledLoader>
      <LoadingSpinner color="secondary" size="large" />
    </StyledLoader>
  );
};

export default Loader;
