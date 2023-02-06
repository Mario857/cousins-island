import React from 'react';
import Typography from '@mui/material/Typography';
import { TerraCurrency } from 'utils/blockchain/blockchain.interface';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatDecimal } from 'utils/currency';
import Stack from '@mui/material/Stack';

interface PriceProps {
  amount: number;
  currency: TerraCurrency;
}

// TODO: Make component more reusable

const Price: React.FC<PriceProps> = ({ amount, currency }) => {
  return (
    <Stack direction="row" alignItems="center">
      <LazyLoadImage
        alt={currency}
        src={currency === 'LUNA' ? '/images/luna.png' : '/images/ust.png'}
        height="16px"
        width="16px"
        style={{ marginBottom: -2 }}
      />
      <Typography
        variant="h200"
        component="h6"
        display="inline-block"
        ml={1}
        mr={1 / 2}
      >
        {formatDecimal(amount)}
      </Typography>
      <Typography variant="body2" color="text.primary">
        ${currency}
      </Typography>
    </Stack>
  );
};

export default Price;
