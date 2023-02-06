import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts';
import { State } from 'store/store';
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'components/Button/Button';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import TxResult from 'components/TxResult/TxResult';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';

interface CompletingTransactionProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  cancelSelling: () => void;
  loading: boolean;
  loadingText: string | boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CompletingTransaction: React.FC<CompletingTransactionProps> = ({
  setOpenModal,
  cancelSelling,
  loading,
  loadingText,
  errorMessage,
  setErrorMessage,
}) => {
  const { tokenDetails, userTradingDetails, collection } = useSelector(
    (state: State) => state.token
  );

  const sellPriceAmount = userTradingDetails?.sellPriceAmount || 0;
  const sellPriceCurrency = userTradingDetails?.sellPriceCurrency;

  const formattedPrice =
    sellPriceCurrency === 'LUNA'
      ? formatLUNADecimal(sellPriceAmount)
      : formatUSTDecimal(sellPriceAmount);

  const details = [
    {
      name: 'Collection',
      value: (
        <>
          <>
            {collection?.title}
            <ExclusiveMark isExclusive={Boolean(collection?.isExclusive)} />
          </>
        </>
      ),
    },
    {
      name: 'Name Item',
      value: tokenDetails?.name,
    },
    {
      name: 'Price',
      value: formattedPrice,
    },
  ];

  return (
    <>
      {details.map((detail, index) => (
        <SeparatedTexts
          key={`cancel-selling-detail-${index}`}
          left={detail.name}
          right={detail.value}
          sx={{ mb: index !== details.length - 1 ? 1 : 0 }}
        />
      ))}
      <Box mt={4}>
        <Grid
          container
          alignItems={{ md: 'center' }}
          spacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Button
              variant="contained"
              color="tertiary"
              fullWidth
              type="button"
              disabled={loading}
              onClick={() => setOpenModal(false)}
            >
              No
            </Button>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="button"
              loading={loading}
              loadingIndicator={<LoadingSpinner />}
              onClick={cancelSelling}
            >
              {loadingText || 'Yes, cancel it!'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {errorMessage && (
        <TxResult
          errorMessage={errorMessage}
          onErrorClose={() => setErrorMessage('')}
          sx={{ mt: 3 }}
        />
      )}
    </>
  );
};

export default CompletingTransaction;
