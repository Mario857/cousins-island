import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts';
import { Bid } from 'utils/blockchain/blockchain.interface';
import React from 'react';
import Stack from '@mui/material/Stack';
import Button from 'components/Button/Button';
import TxResult from 'components/TxResult/TxResult';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';

interface CancelProps {
  selectedBid: Bid | null;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  cancelBid: () => void;
  loading: {
    send: boolean;
    broadcasting: boolean;
  };
  loadingText: string | boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Cancel: React.FC<CancelProps> = ({
  selectedBid,
  setOpenModal,
  cancelBid,
  loading,
  loadingText,
  errorMessage,
  setErrorMessage,
}) => {
  const currency = selectedBid?.currency;
  const amount = selectedBid?.amount;
  const tokenDetails = selectedBid?.tokenDetails;

  const details = [
    {
      label: 'Collection',
      value: (
        <>
          {tokenDetails?.collectionTitle}
          <ExclusiveMark isExclusive={Boolean(tokenDetails?.isExclusive)} />
        </>
      ),
    },
    {
      label: 'Name Item',
      value: tokenDetails?.name,
    },
    {
      label: 'Your Bid',
      value:
        currency === 'LUNA'
          ? formatLUNADecimal(amount || 0)
          : formatUSTDecimal(amount || 0),
    },
  ];

  return (
    <>
      {details.map(
        (detail, index) =>
          detail.value && (
            <SeparatedTexts
              key={`cancel-detail-${index}`}
              left={detail.label}
              right={detail.value}
            />
          )
      )}
      {errorMessage && (
        <TxResult
          errorMessage={errorMessage}
          sx={{ mt: 3 }}
          onErrorClose={() => setErrorMessage('')}
        />
      )}
      <Stack direction="row" alignItems="center" spacing={2} mt={3}>
        <Button
          variant="contained"
          color="tertiary"
          type="button"
          fullWidth
          onClick={() => setOpenModal(false)}
          disabled={loading.send || loading.broadcasting}
        >
          No
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          fullWidth
          onClick={cancelBid}
          loading={loading.send || loading.broadcasting}
          loadingIndicator={<LoadingSpinner />}
        >
          {loadingText || 'Yes, cancel'}
        </Button>
      </Stack>
    </>
  );
};

export default Cancel;
