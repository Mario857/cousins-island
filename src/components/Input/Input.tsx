import { StyledInput } from './Input.styled';
import { InputProps as MuiInputProps } from '@mui/material/Input';
import Typography from '@mui/material/Typography';

export interface InputProps extends Omit<MuiInputProps, 'error'> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...rest }) => {
  return (
    <>
      {label && (
        <Typography
          variant="h300"
          component="label"
          color="text.primary"
          mb={1}
          display="block"
        >
          {label}
        </Typography>
      )}
      <StyledInput {...rest} />
      {error && (
        <Typography variant="body2" color="error.light" mt={1}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default Input;
