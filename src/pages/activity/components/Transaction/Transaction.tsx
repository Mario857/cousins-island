import Card from 'components/Card/Card';
import {
  StyledBadge,
  StyledImage,
  StyledImagePlaceholder,
  StyledImageWrapper,
  StyledLink,
  StyledLinkWrapper,
} from './Transaction.styled';
import Typography from '@mui/material/Typography';
import {
  BoltIcon,
  ExternalLinkIcon,
  FlameIcon,
  ShoppingBagIcon,
} from 'theme/icons';
import { getShortText } from 'utils/getShortText';
import Stack from '@mui/material/Stack';
import { formatDistance } from 'date-fns';
import { useState } from 'react';
import Fade from '@mui/material/Fade';
import LazyLoad from 'react-lazyload';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import {
  LatestTransactionDetails,
  LatestTransactionsType,
} from 'utils/blockchain/blockchain.interface';
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency';
import VideoToken from 'components/VideoToken/VideoToken';
import { useMediaQuery } from 'react-responsive';

interface TransactionsProps {
  transaction: LatestTransactionDetails;
}

function getTxTypeData(txType: LatestTransactionsType) {
  switch (txType) {
    case 'marketplace_execute_order': {
      return {
        label: 'Purchase',
        icon: <ShoppingBagIcon fontSize="small" />,
      };
    }
    case 'marketplace_post_sell_order': {
      return {
        label: 'Listing',
        icon: <BoltIcon fontSize="small" />,
      };
    }

    case 'marketplace_post_buy_order':
    default: {
      return {
        label: 'Bid',
        icon: <FlameIcon fontSize="small" />,
      };
    }
  }
}

const Transaction: React.FC<TransactionsProps> = ({ transaction }) => {
  const { timestamp, terraFinderUrl, tokenDetails, price, currency, type } =
    transaction;

  const buyerShortTerraAddress = getShortText(transaction?.buyer || '', 6);
  const sellerShortTerraAddress = getShortText(transaction?.seller || '', 6);

  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const isVideo = tokenDetails?.imageURL?.includes('.mp4') || tokenDetails?.isVideo;

  const isMobile = useMediaQuery({ maxWidth: 991 });

  const txTypeData = getTxTypeData(type);

  const renderAddressComponent = (address?: string, shortAddress?: string) => {
    return <Typography
      variant={isMobile ? 'h100' : 'h200'}
      color="text.primary"
    >
      <StyledLinkWrapper>
        <a
          target="_blank"
          href={`https://finder.terra.money/columbus-5/address/${address}`}
        >
          {shortAddress}
        </a>
      </StyledLinkWrapper>
    </Typography>
  }

  return (
    <Card sx={{ padding: { xs: '12px', md: '24px' } }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <div>
          {!isVideo ? (
            <StyledImageWrapper>
              <StyledImagePlaceholder />
              {tokenDetails?.imageURL && tokenDetails?.imageURL?.length > 0 && (
                <LazyLoad offset={256}>
                  <Fade in={true}>
                    <StyledImage
                      src={tokenDetails?.imageURL}
                      alt="NFT"
                      onLoad={handleLoad}
                      onError={handleLoad}
                      loaded={loaded}
                    />
                  </Fade>
                </LazyLoad>
              )}
            </StyledImageWrapper>
          ) : (
            <VideoToken
              src={tokenDetails?.imageURL}
              size="small"
              borderRadius="6px"
            />
          )}
        </div>

        <div>
          <StyledBadge>
            <Stack direction="row" alignItems="center">
              {txTypeData.icon}
              <span>{txTypeData.label}</span>
            </Stack>
          </StyledBadge>
          <StyledLinkWrapper>
            <Link
              to={`${ROUTES.COLLECTIONS}/${tokenDetails.nftContractAddress}/${tokenDetails.tokenId}`}
            >
              {tokenDetails?.name || `#${tokenDetails?.tokenId}`}
            </Link>
          </StyledLinkWrapper>
          {type === 'marketplace_execute_order' ? (
            <Typography
              variant={isMobile ? 'body1' : 'body2'}
              color="text.secondary"
              component="p"
              my={1}
            >
              was purchased by{' '}
              {renderAddressComponent(transaction?.buyer, buyerShortTerraAddress)}
              {' '}
              for{' '}
              <Typography
                variant={isMobile ? 'h100' : 'h200'}
                color="text.primary"
              >
                {price} ${currency}
              </Typography>{' '}
              from{' '}
              {renderAddressComponent(transaction?.seller, sellerShortTerraAddress)}

            </Typography>
          ) : (
            <Typography
              variant={isMobile ? 'body1' : 'body2'}
              color="text.secondary"
              component="p"
              my={1}
            >
              {type === 'marketplace_post_buy_order'
                ? <>
                  {renderAddressComponent(transaction?.buyer, buyerShortTerraAddress)}
                  {' '}
                  posted a bid for
                </>
                : 'was put up for sale for'}{' '}
              <Typography
                variant={isMobile ? 'h100' : 'h200'}
                color="text.primary"
              >
                {currency === 'LUNA'
                  ? formatLUNADecimal(price)
                  : formatUSTDecimal(price)}
              </Typography>{' '}
            </Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant={isMobile ? 'body1' : 'body2'}
              color="text.secondary"
              sx={{ lineHeight: '14px !important' }}
            >
              {formatDistance(new Date(timestamp), new Date(), {
                addSuffix: true,
              })}
            </Typography>
            <StyledLink href={terraFinderUrl} target="_blank">
              <ExternalLinkIcon
                sx={{
                  fontSize: { xs: '14px !important', md: '18px !important' },
                }}
              />
            </StyledLink>
          </Stack>
        </div>
      </Stack>
    </Card>
  );
};

export default Transaction;
