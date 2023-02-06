import Stack from '@mui/material/Stack';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { TxReceipt } from 'utils/blockchain/blockchain.interface';
import { CloseIcon, ExclamationMarkIcon } from 'theme/icons';
import Alert from 'components/Alert/Alert';

interface CompletingTransactionProps {
  txReceipt: TxReceipt | null;
  loading: boolean;
  buyNow: () => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CompletingTransaction: React.FC<CompletingTransactionProps> = ({
  txReceipt,
  loading,
  buyNow,
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (!txReceipt) buyNow();
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box pl={1} pt="4px">
          {loading ? (
            <LoadingSpinner size="large" color="secondary" />
          ) : (
            <ExclamationMarkIcon fontSize="medium" />
          )}
        </Box>
        <div>
          <Typography
            variant="h400"
            color="text.primary"
            component="h5"
            mb={1 / 2}
          >
            Purchase
          </Typography>
          <Typography variant="body3" color="text.primary" component="p">
            Confirm the transaction on your wallet
          </Typography>
        </div>
      </Stack>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        fullWidth
        disabled={loading}
        type="button"
        onClick={buyNow}
      >
        Confirm
      </Button>
      {errorMessage && (
        <Alert
          severity="error"
          title="Transaction Failed"
          description={errorMessage}
          sx={{ mt: 3 }}
          onClose={() => setErrorMessage('')}
        />
      )}
    </>
  );
};

export default CompletingTransaction;
