import { State } from 'store/store';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyledImageWrapper } from './TransactionCompleted.styled';
import Typography from '@mui/material/Typography';
import { TxReceipt } from 'utils/blockchain/blockchain.interface';
import TxResult from 'components/TxResult/TxResult';
import Button from 'components/Button/Button';

interface TransactionCompletedProps {
  txReceipt: TxReceipt | null;
  setTxReceipt: React.Dispatch<React.SetStateAction<TxReceipt | null>>;
  successMessage: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionCompleted: React.FC<TransactionCompletedProps> = ({
  txReceipt,
  setTxReceipt,
  successMessage,
  setOpenModal,
}) => {
  const { tokenDetails } = useSelector((state: State) => state.token);
  const token = tokenDetails;

  return (
    <>
      <StyledImageWrapper>
        <img src={token?.imageURL} alt="NFT" />
      </StyledImageWrapper>
      <Typography
        variant="body4"
        color="text.primary"
        mt={2}
        textAlign="center"
        component="p"
      >
        {token?.name}
      </Typography>
      {txReceipt && (
        <TxResult
          txReceipt={txReceipt}
          successMessage={successMessage}
          onSuccessClose={() => setTxReceipt(null)}
          sx={{ mt: 4 }}
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
        Check the offer
      </Button>
    </>
  );
};

export default TransactionCompleted;
