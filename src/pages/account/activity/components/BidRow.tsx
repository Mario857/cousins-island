import React from 'react';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency';
import { Bid } from 'utils/blockchain/blockchain.interface';
import { StyledBidRow } from './BidRow.styled';
import TokenMedia from 'components/TokenMedia/TokenMedia';
import { format } from 'date-fns';
import TypographyLink from 'components/TypographyLink/TypographyLink';
import * as ROUTES from 'constants/routes';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import VideoToken from 'components/VideoToken/VideoToken';

interface BidRowProps {
  bid: Bid;
  onCancelClick: (bid: Bid) => void;
}

const BidRow: React.FC<BidRowProps> = ({ bid, onCancelClick }) => {
  const {
    timestamp,
    amount,
    currency,
    tokenDetails,
    nftContractAddress,
    tokenId,
  } = bid;

  const formattedDate = format(timestamp, 'd MMM y hh:mm bb');

  const tokenURL = `${ROUTES.COLLECTIONS}/${nftContractAddress}/${tokenId}`;

  const isVideo = tokenDetails?.imageURL?.includes('.mp4') || tokenDetails?.isVideo;

  return (
    <StyledBidRow>
      {tokenDetails && (
        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            {!isVideo ? (
              <TokenMedia
                src={tokenDetails?.imageURL}
                alt={tokenDetails?.name}
                width="64px"
                height="64px"
              />
            ) : (
              <VideoToken
                src={tokenDetails?.imageURL}
                size="extra-small"
                borderRadius="8px"
              />
            )}

            <div>
              <TypographyLink
                variant="body3"
                color="text.primary"
                to={tokenURL}
                underline="hover"
              >
                {tokenDetails?.name}
              </TypographyLink>
              <Typography
                variant="body2"
                color="text.secondary"
                component="p"
                mt="4px"
              >
                {tokenDetails?.collectionTitle}{' '}
                <ExclusiveMark
                  isExclusive={Boolean(tokenDetails?.isExclusive)}
                  sx={{ ml: '4px' }}
                />
              </Typography>
            </div>
          </Stack>
        </TableCell>
      )}
      <TableCell>
        <Typography variant="body3" color="text.primary" mb="4px" component="p">
          {formattedDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center" mb="4px">
          <Typography variant="body3" color="text.primary" component="p">
            {currency === 'LUNA'
              ? formatLUNADecimal(amount || 0)
              : formatUSTDecimal(amount || 0)}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Your bid
        </Typography>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="tertiary"
          size="medium"
          type="button"
          onClick={() => {
            onCancelClick(bid);
          }}
        >
          Cancel
        </Button>
      </TableCell>
    </StyledBidRow>
  );
};

export default BidRow;
