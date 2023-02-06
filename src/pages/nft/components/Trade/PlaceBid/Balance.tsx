import { StyledBalance } from './Balance.styled';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextButton from 'components/Button/TextButton';
import React from 'react';
import { View } from './PlaceBid';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import { TerraCurrency } from 'utils/blockchain/blockchain.interface';
import { formatDecimal } from 'utils/currency';

interface BalanceProps {
  setView: React.Dispatch<React.SetStateAction<View>>;
  currency: TerraCurrency;
}

const Balance: React.FC<BalanceProps> = ({ setView, currency }) => {
  const { depositedBalance } = useSelector((state: State) => state.account);

  return (
    <>
      <Typography variant="h300" component="label">
        Offer With
      </Typography>
      <StyledBalance>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <div>
            <Typography
              variant="h200"
              component="h6"
              color="text.primary"
              mb={1}
            >
              Cousin Wallet
            </Typography>
            <Typography variant="body2" color="text.primary" component="p">
              Balance:
              <Typography
                variant="h200"
                component="h6"
                display="inline-block"
                ml="4px"
              >
                {formatDecimal(
                  depositedBalance ? depositedBalance[currency] : 0
                )}{' '}
                ${currency}
              </Typography>
            </Typography>
          </div>
          <TextButton
            color="primary"
            type="button"
            size="large"
            onClick={() => setView(View.DEPOSIT_FUNDS)}
          >
            Deposit funds
          </TextButton>
        </Stack>
      </StyledBalance>
    </>
  );
};

export default Balance;
