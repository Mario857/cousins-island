import { State } from 'store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { StyledImageWrapper } from './CancelSellingCompleted.styled';
import Typography from '@mui/material/Typography';
import { TxReceipt } from 'utils/blockchain/blockchain.interface';
import TxResult from 'components/TxResult/TxResult';
import Button from 'components/Button/Button';

interface CancelSellingCompletedProps {
  txReceipt: TxReceipt | null;
  setTxReceipt: React.Dispatch<React.SetStateAction<TxReceipt | null>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CancelSellingCompleted: React.FC<CancelSellingCompletedProps> = ({
  txReceipt,
  setTxReceipt,
  setOpenModal,
}) => {
  const { tokenDetails } = useSelector((state: State) => state.token);

  return (
    <div>
      <StyledImageWrapper>
        <img src={tokenDetails?.imageURL} alt="NFT" />
      </StyledImageWrapper>
      <Typography
        variant="body4"
        color="text.primary"
        mt={2}
        textAlign="center"
        component="p"
      >
        {tokenDetails?.name}
      </Typography>
      {txReceipt && (
        <TxResult
          txReceipt={txReceipt}
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
        Back to NFT
      </Button>
    </div>
  );
};

export default CancelSellingCompleted;
