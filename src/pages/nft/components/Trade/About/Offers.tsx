import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import TextButton from 'components/Button/TextButton';
import { Bid, BidTokenDetails } from 'utils/blockchain/blockchain.interface';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import { getShortText } from 'utils/getShortText';
import { formatDecimal } from 'utils/currency';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import AcceptOfferModal from '../AcceptOfferModal/AcceptOfferModal';
import { formatDistance } from 'date-fns';
import Select from 'components/Select/Select';
import MenuItem from '@mui/material/MenuItem';
import { useWallet } from '@terra-money/wallet-provider';
import CancelBidModal from 'components/CancelBidModal/CancelBidModal';

interface OfferProps {
  isLast: boolean;
  bid: Bid;
  doesUserOwnToken?: boolean;
  userAddress: string;
  onAcceptClick: (bid: Bid) => void;
  onCancelClick: (bid: Bid) => void;
}

const Offer: React.FC<OfferProps> = ({
  isLast,
  bid,
  doesUserOwnToken,
  userAddress,
  onAcceptClick,
  onCancelClick,
}) => {
  const { amount, currency, creatorAddress, timestamp } = bid;
  const { collection } = useSelector((state: State) => state.token);

  const isExclusive = collection?.isExclusive;

  const bidWithIsExclusive = {
    ...bid,
    tokenDetails: {
      ...bid.tokenDetails,
      isExclusive: Boolean(isExclusive),
    } as BidTokenDetails,
  };

  const shortCreatorAddress = getShortText(creatorAddress, 6);

  const isUserCreator = creatorAddress === userAddress;

  return (
    <Box
      px={3}
      py={2}
      borderBottom={!isLast ? '1px solid rgba(255, 255, 255, 0.18)' : undefined}
    >
      {amount && currency && (
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          mb={1}
        >
          <div>
            <LazyLoadImage
              src={currency === 'LUNA' ? '/images/luna.png' : '/images/ust.png'}
              alt={currency}
              width="16px"
              height="16px"
              style={{ marginBottom: -3 }}
            />
            <Typography
              variant="h300"
              color="text.primary"
              component="h5"
              display="inline-block"
              mr="4px"
              ml="8px"
            >
              {formatDecimal(amount)}
            </Typography>
            <Typography variant="body3" color="text.primary">
              ${currency}
            </Typography>
          </div>
          {doesUserOwnToken && (
            <TextButton
              color="primary"
              size="large"
              type="button"
              onClick={() => onAcceptClick(bidWithIsExclusive)}
            >
              Accept Offer
            </TextButton>
          )}
          {isUserCreator && (
            <TextButton
              color="light"
              size="large"
              type="button"
              onClick={() => onCancelClick(bidWithIsExclusive)}
            >
              Cancel Offer
            </TextButton>
          )}
        </Stack>
      )}
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <div>
          <Typography
            variant="body2"
            color="text.primary"
            display="inline-block"
            mr="4px"
          >
            from
          </Typography>
          <Typography
            variant="h200"
            color="text.primary"
            component="h6"
            display="inline-block"
          >
            {shortCreatorAddress}
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary">
          {formatDistance(new Date(timestamp), new Date(), {
            addSuffix: true,
          })}
        </Typography>
      </Stack>
    </Box>
  );
};

enum BidsSortBy {
  HIGHEST_TO_LOWEST = 'highestToLowest',
  LOWEST_TO_HIGHEST = 'lowestToHighest',
}

const Offers = () => {
  const { tokenDetails, userTradingDetails, bids, tokenLoaders } = useSelector(
    (state: State) => state.token
  );
  const tokenName = tokenDetails?.name;

  const doesUserOwnToken = userTradingDetails?.doesUserOwnIt;

  const [sortBy, setSortBy] = useState<BidsSortBy>(
    BidsSortBy.HIGHEST_TO_LOWEST
  );

  const sortedBids = bids ? bids[sortBy] : null;

  const wallet = useWallet();

  const userAddress = wallet?.wallets?.[0]?.terraAddress;

  const [selectedBid, setSelectedBid] = useState<null | Bid>(null);

  const [openCancelBidModal, setOpenCancelBidModal] = useState(false);
  const [openAcceptBidModal, setOpenAcceptBidModal] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const onAcceptClick = (bid: Bid) => {
    setSelectedBid(bid);
    setOpenAcceptBidModal(true);
  };

  const onCancelClick = (bid: Bid) => {
    setSelectedBid(bid);
    setCanceled(false);
    setOpenCancelBidModal(true);
  };

  return (
    <>
      {tokenLoaders?.getAllBidsForToken ||
      !sortedBids ||
      sortedBids?.length <= 0 ? (
        <Box
          px={3}
          py={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight={132}
        >
          {tokenLoaders?.getAllBidsForToken ||
          tokenLoaders?.removeBidFromTokenBids ? (
            <LoadingSpinner color="secondary" size="large" />
          ) : (
            <Typography variant="body3" color="text.primary" component="p">
              No bids for {tokenName}
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <Box px={3} py={2} borderBottom="1px solid rgba(255, 255, 255, 0.18)">
            <Select
              value={sortBy}
              fullWidth
              onChange={(e) => setSortBy(e.target.value as BidsSortBy)}
            >
              <MenuItem value={BidsSortBy.HIGHEST_TO_LOWEST}>Highest</MenuItem>
              <MenuItem value={BidsSortBy.LOWEST_TO_HIGHEST}>Lowest</MenuItem>
            </Select>
          </Box>
          {sortedBids.map((bid, index) => (
            <Offer
              key={`offer-${index}`}
              bid={bid}
              doesUserOwnToken={doesUserOwnToken}
              isLast={index === sortedBids.length - 1}
              userAddress={userAddress}
              onAcceptClick={onAcceptClick}
              onCancelClick={onCancelClick}
            />
          ))}
        </>
      )}
      <CancelBidModal
        bid={selectedBid}
        openModal={openCancelBidModal}
        setOpenModal={setOpenCancelBidModal}
        canceled={canceled}
        setCanceled={setCanceled}
      />
      {doesUserOwnToken && (
        <AcceptOfferModal
          selectedBid={selectedBid}
          openModal={openAcceptBidModal}
          setOpenModal={setOpenAcceptBidModal}
        />
      )}
    </>
  );
};

export default Offers;
