import { StyledSelect } from './Select.styled';
import { SelectProps as MuiSelectProps } from '@mui/material/Select';
import { AngleDownIcon } from 'theme/icons';
import Typography from '@mui/material/Typography';

interface SelectProps extends Omit<MuiSelectProps, 'error'> {
  label?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({ children, label, error, ...rest }) => {
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
      <StyledSelect
        IconComponent={(props) => <AngleDownIcon {...props} fontSize="small" />}
        {...rest}
      >
        {children}
      </StyledSelect>
      {error && (
        <Typography variant="body2" color="error.light" mt={1}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default Select;
