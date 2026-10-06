import TokenMedia from 'components/TokenMedia/TokenMedia';
import { State } from 'store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import { TxReceipt } from 'utils/blockchain/blockchain.interface';
import TxResult from 'components/TxResult/TxResult';
import Button from 'components/Button/Button';

interface TransferCompletedProps {
  txReceipt: null | TxReceipt;
  setTxReceipt: React.Dispatch<React.SetStateAction<TxReceipt | null>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransferCompleted: React.FC<TransferCompletedProps> = ({
  txReceipt,
  setTxReceipt,
  setOpenModal,
}) => {
  const { tokenDetails, collection } = useSelector(
    (state: State) => state.token
  );

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ width: '319px' }}>
          <Box sx={{ height: '319px', width: '319px' }}>
            <TokenMedia
              src={tokenDetails?.imageURL}
              alt={tokenDetails?.name}
              height="319px"
            />
          </Box>
          {collection && (
            <Typography
              variant="h300"
              sx={{ color: 'text.primary', mt: 2, mb: 1 }}
              component="h6"
            >
              {collection?.title}
              <ExclusiveMark isExclusive={collection?.isExclusive!} />
            </Typography>
          )}
          <Typography variant="h500" sx={{ color: 'text.primary' }} component="h5">
            {tokenDetails?.name}
          </Typography>
        </Box>
      </Box>
      {txReceipt && (
        <TxResult
          txReceipt={txReceipt}
          onSuccessClose={() => setTxReceipt(null)}
          sx={{ mt: 3 }}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        type="button"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => setOpenModal(false)}
      >
        Done
      </Button>
    </>
  );
};

export default TransferCompleted;
