import React from 'react';
import { StyledCheckbox, StyledCheckIcon, StyledIcon } from './Checkox.styled';
import { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { CheckIcon } from 'theme/icons';

const Checkbox: React.FC<MuiCheckboxProps> = ({ ...rest }) => {
  return (
    <StyledCheckbox
      checkedIcon={
        <StyledCheckIcon>
          <CheckIcon fontSize="small" />
        </StyledCheckIcon>
      }
      icon={<StyledIcon />}
      {...rest}
    />
  );
};

export default Checkbox;
