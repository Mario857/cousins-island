import React, { useEffect } from 'react';
import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts';
import Button from 'components/Button/Button';
import { State } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import TxResult from 'components/TxResult/TxResult';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import blockchain from 'utils/blockchain/real/luart-api';
import Alert from 'components/Alert/Alert';
import { getLunaPrice } from 'store/actions/statistics';

interface CompletingTransactionProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loadingText: string | boolean;
  loading: boolean;
  handleSell: (e: React.MouseEvent<HTMLElement>) => void;
  formattedPrice: string;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  currency: string;
  price: number;
  amountAfterSold: string;
}

const CompletingTransaction: React.FC<CompletingTransactionProps> = ({
  setOpenModal,
  loadingText,
  loading,
  handleSell,
  formattedPrice,
  errorMessage,
  setErrorMessage,
  currency,
  price,
  amountAfterSold,
}) => {
  const { tokenDetails, collection, userTradingDetails } = useSelector(
    (state: State) => state.token
  );
  const { statisticsLoaders, lunaPrice } = useSelector(
    (state: State) => state.statistics
  );

  const dispatch = useDispatch();

  const token = tokenDetails;

  const [belowFloor, setBelowFloor] = React.useState(false);
  const [floorPrice, setFloorPrice] = React.useState<null | number>(null);

  const getFloorPrice = async () => {
    const nftContractAddress = token?.nftContractAddress;

    if (nftContractAddress != null) {
      const floorPrice = await blockchain.getFloorPriceInCollection(
        nftContractAddress
      );

      setFloorPrice(floorPrice);
    }
  };

  const checkIfPriceIsBelowFloor = () => {
    if (floorPrice && lunaPrice) {
      if (currency === 'UST') {
        const floorPriceInUst = floorPrice * lunaPrice;
        setBelowFloor(price < floorPriceInUst);
      } else {
        setBelowFloor(price < floorPrice);
      }
    }
  };

  useEffect(() => {
    if (!statisticsLoaders?.getLunaPrice) {
      dispatch(getLunaPrice() as any);
    }
  }, [dispatch]);

  useEffect(() => {
    if (price) {
      getFloorPrice();
    }

    if (price && floorPrice && lunaPrice) {
      checkIfPriceIsBelowFloor();
    }
  }, [price, floorPrice, lunaPrice]);

  const details = [
    {
      name: 'Collection',
      value: (
        <>
          {collection?.title}
          <ExclusiveMark isExclusive={Boolean(collection?.isExclusive)} />
        </>
      ),
    },
    {
      name: 'Name Item',
      value: token?.name,
    },
    {
      name: 'Listing Price',
      value: (
        <>
          {formattedPrice}
          <LazyLoadImage
            src={currency === 'LUNA' ? '/images/luna.png' : '/images/ust.png'}
            alt={currency}
            height="16px"
            width="16px"
            style={{ marginLeft: '8px', marginBottom: '-2px' }}
          />
        </>
      ),
    },
    {
      name: 'Cousin Fee',
      value: userTradingDetails?.sellFees?.luartFee,
    },
    {
      name: 'Royalty Fee',
      value: userTradingDetails?.sellFees?.royaltyFee,
    },
    {
      name: 'Listing Fee',
      value: '0.2 $UST',
    },
    {
      name: 'Amount after sold',
      value: amountAfterSold,
    },
  ];

  return (
    <>
      {details.map((detail, index) => (
        <SeparatedTexts
          key={`sell-detail-${index}`}
          left={detail.name}
          right={detail.value}
          sx={{ mb: index !== details.length - 1 ? 1 : 0 }}
        />
      ))}
      <Box mt={3}>
        {belowFloor && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            title="You are going to list the item below collection floor price."
          />
        )}
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
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="button"
              onClick={handleSell}
              loading={loading}
              loadingIndicator={<LoadingSpinner />}
            >
              {loadingText || 'Yes, sell'}
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
