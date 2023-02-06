import React from 'react';
import { StyledCountButton, StyledCountInput } from './CountInput.styled';
import { MinusIcon, PlusIcon } from 'theme/icons';
import { InputProps } from 'components/Input/Input';

interface CountInputProps extends InputProps {
  handleDecrement: () => void;
  handleIncrement: () => void;
  min: number;
  max?: number;
  count: number;
}

const CountInput: React.FC<CountInputProps> = ({
  handleDecrement,
  handleIncrement,
  min,
  max,
  count,
  ...rest
}) => {
  return (
    <StyledCountInput
      type="number"
      {...rest}
      startAdornment={
        <StyledCountButton
          type="button"
          onClick={handleDecrement}
          active={count > min}
          disabled={count === min}
        >
          <MinusIcon viewBox="0 -6 27 27" />
        </StyledCountButton>
      }
      endAdornment={
        <StyledCountButton
          type="button"
          onClick={handleIncrement}
          active={max ? count < max : true}
          disabled={max ? count === max : false}
        >
          <PlusIcon viewBox="0 0 27 27" />
        </StyledCountButton>
      }
    />
  );
};

export default CountInput;
