import Card from 'components/Card/Card';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Deposit from './Deposit';
import { formatDecimal } from 'utils/currency';
import { TerraCurrency } from 'utils/blockchain/blockchain.interface';

interface WalletProps {
  currency: TerraCurrency;
  balance: number;
}

const Wallet: React.FC<WalletProps> = ({ currency, balance }) => {
  return (
    <Card>
      <LazyLoadImage
        src={
          currency === 'LUNA'
            ? '/images/terra-luna-large.png'
            : '/images/ust-large.png'
        }
        alt={currency}
        width="48px"
        height="48px"
      />
      <Typography
        variant="h400"
        component="h5"
        color="text.primary"
        sx={{ fontWeight: '600 !important' }}
        mt={4}
        mb={1}
      >
        Account balance
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h600" color="text.primary">
          ${currency}
        </Typography>
        <Typography variant="h600" color="text.primary">
          {formatDecimal(balance)}
        </Typography>
      </Stack>
      <Deposit currency={currency} balance={balance} />
    </Card>
  );
};

export default Wallet;
