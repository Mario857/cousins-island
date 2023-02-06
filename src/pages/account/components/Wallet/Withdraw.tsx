import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from 'components/Button/Button';
import {
  Balance,
  TerraCurrency,
  TxReceipt,
} from 'utils/blockchain/blockchain.interface';
import useBroadcastingTx from 'hooks/useBroadcastingTx';
import blockchainModule from 'utils/blockchain/blockchain';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import TxResult from 'components/TxResult/TxResult';

interface WithdrawProps {
  amount: string;
  currency: TerraCurrency;
  balance: number;
  errors: {
    [key: string]: string;
  };
  onSuccessBroadcast: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({
  amount,
  currency,
  balance,
  errors,
  onSuccessBroadcast,
}) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [txReceipt, setTxReceipt] = useState<null | TxReceipt>(null);

  const { loading, setLoading, loadingText } = useBroadcastingTx(
    txReceipt?.txId,
    onSuccessBroadcast
  );

  const withdraw = async () => {
    setLoading((loading) => ({ ...loading, send: true }));

    try {
      const txReceipt = await blockchainModule.withdraw(
        parseFloat(amount),
        currency
      );

      setTxReceipt(txReceipt);
      setSuccessMessage('You have successfully withdrawn your funds.');
      setErrorMessage('');
    } catch (error) {
      console.log(error);
      setSuccessMessage('');
      setErrorMessage('There was an error while processing the transaction.');
      setLoading((loading) => ({ ...loading, send: false }));
    }
  };

  return (
    <Box mt={2}>
      <Button
        variant="contained"
        color="tertiary"
        type="button"
        fullWidth
        onClick={withdraw}
        loading={loading.broadcasting || loading.send}
        loadingIndicator={<LoadingSpinner color="secondary" />}
        disabled={Boolean(
          parseFloat(amount) > balance || !amount || errors.amount
        )}
      >
        {loadingText || 'Withdraw'}
      </Button>
      {(errorMessage || successMessage) && !loading.broadcasting && (
        <TxResult
          successMessage={successMessage}
          errorMessage={errorMessage}
          onErrorClose={() => setErrorMessage('')}
          onSuccessClose={() => {
            setSuccessMessage('');
            setTxReceipt(null);
          }}
          txReceipt={txReceipt}
          sx={{ mt: 3 }}
        />
      )}
    </Box>
  );
};

export default Withdraw;
