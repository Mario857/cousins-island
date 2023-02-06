import React from 'react';
import Typography from '@mui/material/Typography';
import Chip from 'components/Chip/Chip';
import Grid from '@mui/material/Grid';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { TerraCurrency } from 'utils/blockchain/blockchain.interface';

interface CurrencySelectorProps {
  label?: string;
  currency: TerraCurrency;
  handleChange: (currency: TerraCurrency) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  currency,
  handleChange,
}) => {
  const currencyOptions = [
    {
      label: '$LUNA',
      value: 'LUNA',
      image: {
        src: '/images/luna.png',
        width: '14px',
        height: '14px',
      },
    },
    {
      label: '$UST',
      value: 'UST',
      image: {
        src: '/images/ust.png',
        width: '16px',
        height: '16px',
      },
    },
  ];

  return (
    <>
      {label && (
        <Typography variant="h300" component="label" color="text.primary">
          {label}
        </Typography>
      )}
      <Grid container columnSpacing={3} mb={3} mt={1}>
        {currencyOptions.map((option, index) => (
          <Grid item xs={6} key={`currency-option-${index}`}>
            <Chip
              label={option.label}
              size="medium"
              sx={{ width: '100% ' }}
              clickable
              onClick={() => handleChange(option.value as TerraCurrency)}
              color={currency === option.value ? 'primary' : 'secondary'}
              icon={
                <LazyLoadImage
                  src={option.image.src}
                  alt={option.value}
                  height={option.image.height}
                  width={option.image.width}
                  style={{
                    marginRight: 8,
                    marginBottom: option.value === 'LUNA' ? -1 : -2,
                  }}
                />
              }
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CurrencySelector;
