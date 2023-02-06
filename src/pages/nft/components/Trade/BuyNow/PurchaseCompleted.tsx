import {
  StyledImageWrapper,
  StyledNFTDetails,
} from './PurchaseCompleted.styled';
import Typography from '@mui/material/Typography';
import Heading from 'components/Heading/Heading';
import Button from 'components/Button/Button';
import Alert from 'components/Alert/Alert';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { TxReceipt } from 'utils/blockchain/blockchain.interface';
import { getShortText } from 'utils/getShortText';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import React from 'react';

interface PurchaseCompletedProps {
  txReceipt: TxReceipt | null;
  setTxReceipt: React.Dispatch<React.SetStateAction<TxReceipt | null>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PurchaseCompleted: React.FC<PurchaseCompletedProps> = ({
  txReceipt,
  setTxReceipt,
  setOpenModal,
}) => {
  const { tokenDetails, collection } = useSelector(
    (state: State) => state.token
  );

  const tokenName = tokenDetails?.name;
  const imageURL = tokenDetails?.imageURL;
  const collectionTitle = tokenDetails?.collectionTitle;

  const shortTxId = getShortText(txReceipt?.txId || '', 6);

  return (
    <>
      <StyledNFTDetails>
        <StyledImageWrapper>
          <LazyLoadImage
            src={imageURL}
            alt="NFT"
            width="256px"
            height="256px"
          />
        </StyledImageWrapper>
        <Typography
          variant="body3"
          component="p"
          color="text.secondary"
          mt={1}
          mb={1 / 2}
        >
          {collectionTitle}
          <ExclusiveMark
            isExclusive={Boolean(collection?.isExclusive || false)}
          />
        </Typography>
        <Heading variant="h400" component="h5">
          {tokenName}
        </Heading>
      </StyledNFTDetails>
      {txReceipt && (
        <Alert
          severity="success"
          title="Transaction broadcasted!"
          sx={{ mt: 3 }}
          onClose={() => setTxReceipt(null)}
        >
          <Typography variant="body2" color="text.secondary">
            Tx Hash:{' '}
            <a href={txReceipt?.txTerraFinderUrl} target="_blank">
              {shortTxId}
            </a>
          </Typography>
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="button"
        sx={{ mt: 3 }}
        onClick={() => setOpenModal(false)}
      >
        View my Item
      </Button>
    </>
  );
};

export default PurchaseCompleted;
