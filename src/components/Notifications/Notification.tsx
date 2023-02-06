import { useState } from 'react';
import {
  StyledBadge,
  StyledNotification,
  StyledDot,
  StyledImageWrapper,
  StyledImage,
  StyledImagePlaceholder,
  StyledTextContainer,
} from './Notification.styled';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LazyLoad from 'react-lazyload';
import Fade from '@mui/material/Fade';
import { LatestTransactionDetails } from 'utils/blockchain/blockchain.interface';
import { getShortText } from 'utils/getShortText';
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency';
import { formatInTimeZone } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import { TIMEZONE } from 'utils/date';
import * as ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import TokenMedia from 'components/TokenMedia/TokenMedia';
import VideoToken from 'components/VideoToken/VideoToken';

interface NotificationProps {
  notification: LatestTransactionDetails;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { latestReadTimestamp } = useSelector(
    (state: State) => state.notifications
  );
  const {
    buyer,
    currency,
    price,
    terraFinderUrl,
    timestamp,
    type,
    tokenDetails,
  } = notification;

  const shortBuyerAddress = getShortText(buyer || '', 6);

  const [loaded, setLoaded] = useState(false);

  const formattedDate = formatInTimeZone(timestamp, TIMEZONE, 'LLL d, y hh:mm b');

  const isUnread = latestReadTimestamp < timestamp;

  const linkComponent = (isAnchorElement: boolean, children: JSX.Element) => {
    if (isAnchorElement) {
      return <a target="_blank" href={terraFinderUrl}>{children}</a>;
    } else {
      return <Link to={`${ROUTES.COLLECTIONS}/${tokenDetails?.nftContractAddress}/${tokenDetails?.tokenId}?tab=1`}>{children}</Link>;
    }
  }

  const getNotificationDetails = () => {
    if (type === 'marketplace_post_buy_order') {
      return {
        description: 'posted a bid for',
        badge: 'Bid',
        redirectToTerraFinder: false
      }
    } else {
      return {
        description: 'bought from you',
        badge: 'Sell',
        redirectToTerraFinder: true
      }
    }
  }

  const notificationDetails = getNotificationDetails();

  const isVideo = tokenDetails?.imageURL?.includes('.mp4') || tokenDetails?.isVideo;

  return (
    <StyledNotification>
      {linkComponent(notificationDetails.redirectToTerraFinder, <Stack
        direction="row"
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <div>
          {!isVideo ? (
            <TokenMedia
              src={tokenDetails?.imageURL}
              alt={tokenDetails?.name}
              width="68px"
              height="68px"
              borderRadius="4px"
            />
          ) : (
            <VideoToken
              src={tokenDetails?.imageURL}
              size="extra-small"
              borderRadius="4px"
            />
          )}
        </div>
        <div>
          <StyledBadge>{notificationDetails.badge}</StyledBadge>
          <Stack direction="row" spacing={1} mt={1}>
            <div>
              <StyledDot color={isUnread ? 'red' : 'gray'} />
            </div>
            <StyledTextContainer>
              <Typography
                variant="body2"
                color="text.primary"
                mb={1}
                sx={{ lineHeight: '20px !important' }}
              >
                {shortBuyerAddress} {notificationDetails.description}{' '}
                <Typography
                  variant="h200"
                  component="h6"
                  display="inline-block"
                >
                  {tokenDetails?.name}
                </Typography>{' '}
                for{' '}
                <Typography
                  variant="h200"
                  component="h6"
                  display="inline-block"
                >
                  {currency === 'LUNA'
                    ? formatLUNADecimal(price)
                    : formatUSTDecimal(price)}
                </Typography>{' '}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formattedDate} UTC
              </Typography>
            </StyledTextContainer>
          </Stack>
        </div>
      </Stack>)}
    </StyledNotification>
  );
};

export default Notification;
