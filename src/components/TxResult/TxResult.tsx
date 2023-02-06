import Alert from 'components/Alert/Alert';
import { TxReceipt } from 'utils/blockchain/blockchain.interface';
import { getShortText } from 'utils/getShortText';
import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

interface TxResultProps {
  successMessage?: string;
  errorMessage?: string;
  txReceipt?: TxReceipt | null;
  onSuccessClose?: () => void;
  onErrorClose?: () => void;
  sx?: SxProps;
}

const TxResult: React.FC<TxResultProps> = ({
  successMessage,
  errorMessage,
  txReceipt,
  onSuccessClose,
  onErrorClose,
  sx = {},
}) => {
  if (errorMessage) {
    return (
      <Alert
        severity="error"
        title="Transaction failed!"
        description={errorMessage}
        onClose={onErrorClose}
        sx={sx}
      />
    );
  }

  const shortTxId = getShortText(txReceipt?.txId || '', 6);

  return (
    <Alert
      severity="success"
      title="Transaction broadcasted!"
      description={successMessage}
      onClose={onSuccessClose}
      sx={sx}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        component="p"
        mt={successMessage ? 1 : 0}
      >
        Tx Hash:{' '}
        <a href={txReceipt?.txTerraFinderUrl} target="_blank">
          {shortTxId}
        </a>
      </Typography>
    </Alert>
  );
};

export default TxResult;
