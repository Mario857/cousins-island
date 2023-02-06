import Input from 'components/Input/Input';
import { StyledLoadingContainer, StyledSignUpForm } from './SignUpForm.styled';
import Button from '@mui/material/Button';
import { useSubscribe } from 'hooks/useSubscribe';
import Typography from '@mui/material/Typography';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Stack from '@mui/material/Stack';
import Checkbox from 'components/Checkbox/Checkbox';
import * as ROUTES from 'constants/routes';

const SignUpForm = () => {
  const {
    handleSubmit,
    handleChange,
    errors,
    email,
    loading,
    success,
    tosChecked,
    setTosChecked,
  } = useSubscribe();

  return (
    <StyledSignUpForm onSubmit={handleSubmit}>
      <Input
        placeholder="Your Email"
        id="email"
        endAdornment={
          loading ? (
            <StyledLoadingContainer>
              <LoadingSpinner />
            </StyledLoadingContainer>
          ) : (
            <Button type="submit" color="primary">
              Sign up
            </Button>
          )
        }
        type="email"
        value={email}
        onChange={handleChange}
      />
      <Stack
        direction="row"
        spacing={2}
        mt={2}
        onClick={() => setTosChecked(!tosChecked)}
        sx={{ cursor: 'pointer' }}
      >
        <Checkbox checked={tosChecked} sx={{ mt: '3px' }} />
        <Typography
          variant="body2"
          color="text.primary"
          component="p"
          sx={{ lineHeight: '26px !important' }}
        >
          I agree to the processing of personal data by Cousin Island for marketing
          purposes and accept{' '}
          <a href={ROUTES.TOS} target="blank" rel="noreferrer">
            Terms of Service
          </a>
        </Typography>
      </Stack>
      {(errors.email || errors.api || errors.tosChecked) && (
        <Typography variant="body2" color="error.light" mt={2}>
          {errors.email || errors.api || errors.tosChecked}
        </Typography>
      )}
      {success && (
        <Typography variant="body2" color="primary" mt={2}>
          {success}
        </Typography>
      )}
    </StyledSignUpForm>
  );
};

export default SignUpForm;
