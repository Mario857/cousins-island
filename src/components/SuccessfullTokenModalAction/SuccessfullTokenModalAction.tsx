import TokenMedia from 'components/TokenMedia/TokenMedia';
import React from 'react';
import Box from '@mui/material/Box';
import Card from 'components/Card/Card';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import {
  BidTokenDetails,
  NFTTokenDetails,
  TxReceipt,
} from 'utils/blockchain/blockchain.interface';
import TxResult from 'components/TxResult/TxResult';

interface SuccessfullTokenModalActionProps {
  txReceipt: null | TxReceipt;
  setTxReceipt: React.Dispatch<React.SetStateAction<null | TxReceipt>>;
  successMessage?: string;
  setSuccessMessage?: React.Dispatch<React.SetStateAction<string>>;
  tokenDetails?: NFTTokenDetails | BidTokenDetails | null;
  onCloseModal: () => void;
}

const SuccessfullTokenModalAction: React.FC<SuccessfullTokenModalActionProps> =
  ({
    txReceipt,
    successMessage,
    setTxReceipt,
    setSuccessMessage,
    tokenDetails,
    onCloseModal,
  }) => {
    return (
      <>
        {tokenDetails && (
          <Box display="flex" alignItems="center" flexDirection="column">
            <Card sx={{ p: 2 }}>
              <TokenMedia
                src={tokenDetails?.imageURL}
                alt={tokenDetails?.name}
                height="211px"
                width="211px"
              />
            </Card>
            <Typography
              variant="body3"
              color="text.primary"
              component="p"
              mt={2}
            >
              {tokenDetails?.name}
            </Typography>
          </Box>
        )}
        {txReceipt && (
          <TxResult
            txReceipt={txReceipt}
            successMessage={successMessage}
            onSuccessClose={() => {
              if (setSuccessMessage) setSuccessMessage('');
              setTxReceipt(null);
            }}
            sx={{ mt: 3 }}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          type="button"
          fullWidth
          sx={{ mt: 3 }}
          onClick={onCloseModal}
        >
          Done
        </Button>
      </>
    );
  };

export default SuccessfullTokenModalAction;
