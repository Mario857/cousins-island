import React from 'react';
import {
  StyledAvailableButton,
  StyledCurrency,
  StyledCurrencyInputWrapper,
} from './CurrencyInput.styled';
import Typography from '@mui/material/Typography';
import Input, { InputProps } from 'components/Input/Input';
import Grid from '@mui/material/Grid';
import {
  formatLUNADecimal,
  formatUSTDecimal,
  toDecimal,
} from 'utils/currency';
import { values } from 'lodash';

interface CurrencyInputProps extends InputProps {
  currency?: string;
  available?: number;
  onAvailableClick?: () => void;
  onHalfPriceClick?: () => void;
  error?: string;
  lunaPrice?: number;
  sellPrice?: number;
  sellCurrency?: string;
  isHalfPrice?: boolean;
  isBidMoreHalf?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  currency = 'UST',
  available,
  onAvailableClick,
  onHalfPriceClick,
  label,
  onChange,
  error,
  readOnly,
  lunaPrice,
  sellPrice,
  sellCurrency,
  isHalfPrice,
  isBidMoreHalf,
  ...rest
}) => {
  const pattern: RegExp = new RegExp(/^[0-9.]\d*$/g);

  const props = {
    type: 'number',
    autoComplete: 'off',
    placeholder: '0.00',
    inputProps: {
      inputMode: 'decimal' as 'decimal',
      min: 0,
      step: 0.01,
    },
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!pattern.test(e.key) && e.key !== ',') {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData?.getData('text');

      if (!pattern.test(pastedText)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  };

  const [halfPrice, setHalfPrice] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lunaPrice && currency && sellPrice && sellCurrency) {
      prepareHalfPrice();
    }
  }, [currency]);

  const prepareHalfPrice = () => {
    let halfPrice;
    if (currency === 'UST' && lunaPrice && sellPrice) {
      if (sellCurrency === 'UST') {
        halfPrice = sellPrice / 1.995;
      } else {
        halfPrice = (sellPrice * lunaPrice) / 1.995;
      }
      setHalfPrice(toDecimal(halfPrice).toString());
    }
    if (currency === 'LUNA' && lunaPrice && sellPrice) {
      if (sellCurrency === 'LUNA') {
        halfPrice = sellPrice / 1.995;
      } else {
        halfPrice = sellPrice / lunaPrice / 1.995;
      }
      setHalfPrice(toDecimal(halfPrice).toString());
    }
  };

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
      <StyledCurrencyInputWrapper readOnly={readOnly}>
        <StyledCurrency>
          <Typography variant="body3" color="text.secondary">
            ${currency}
          </Typography>
        </StyledCurrency>
        <Input {...rest} {...props} readOnly={readOnly} onChange={onChange} />
      </StyledCurrencyInputWrapper>
      <Grid
        container
        sx={{
          mt: 1,
          minHeight: error || available || available === 0 ? '20px' : 0,
        }}
      >
        <Grid
          item
          xs={12}
          md={!available && available !== 0 ? 12 : 7}
          sx={{ textAlign: { xs: 'right', sm: 'left' } }}
        >
          {error && (
            <Typography variant="body2" color="error.light" marginBottom={1}>
              {error || ''}
            </Typography>
          )}

          {!isHalfPrice && !isBidMoreHalf && (
            <StyledAvailableButton type="button" onClick={onHalfPriceClick}>
              {currency === 'LUNA' &&
                halfPrice &&
                'Minimum bid more than ' + formatLUNADecimal(halfPrice)}
              {currency === 'UST' &&
                halfPrice &&
                'Minimum bid more than ' + formatUSTDecimal(halfPrice)}
            </StyledAvailableButton>
          )}
        </Grid>
        <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
          {(available || available === 0) && onAvailableClick && (
            <StyledAvailableButton type="button" onClick={onAvailableClick}>
              {currency === 'LUNA'
                ? formatLUNADecimal(available)
                : formatUSTDecimal(available)}{' '}
              Available
            </StyledAvailableButton>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CurrencyInput;
