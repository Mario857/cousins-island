import { StyledCheckedIcon, StyledIcon, StyledRadio } from './Radio.styled';
import { RadioProps as MuiRadioProps } from '@mui/material/Radio';

const Radio: React.FC<MuiRadioProps> = ({ ...rest }) => {
  return (
    <StyledRadio
      checkedIcon={<StyledCheckedIcon />}
      icon={<StyledIcon />}
      {...rest}
    />
  );
};

export default Radio;
