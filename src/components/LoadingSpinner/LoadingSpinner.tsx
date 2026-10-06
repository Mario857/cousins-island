import {
  StyledLoadingSpinner,
  StyledLoadingSpinnerProps,
  StyledLoadingSpinnerContainer,
} from './LoadingSpinner.styled';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface LoadingSpinnerProps extends StyledLoadingSpinnerProps {
  addText?: boolean;
  center?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  addText = false,
  center = false,
  ...rest
}) => {
  return (
    <StyledLoadingSpinnerContainer center={center}>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
        <StyledLoadingSpinner {...rest} />
        {addText && (
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Loading...
          </Typography>
        )}
      </Stack>
    </StyledLoadingSpinnerContainer>
  );
};

export default LoadingSpinner;
