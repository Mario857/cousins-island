import React from 'react';
import Stack from '@mui/material/Stack';
import { StyledLabel, StyledTransaction } from './Transaction.styled';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Typography from '@mui/material/Typography';
import { Type } from './Activity';
import { LatestTransactionDetails } from 'utils/blockchain/blockchain.interface';
import { formatDecimal } from 'utils/currency';
import { getShortText } from 'utils/getShortText';
import { formatDistance } from 'date-fns';
import TypographyLink from 'components/TypographyLink/TypographyLink';
import { ExternalLinkIcon } from 'theme/icons';
import getTerraFinderUrl from 'utils/getTerraFinderUrl';

interface TransactionProps {
  types: Type[];
  transaction: LatestTransactionDetails;
}

const Transaction: React.FC<TransactionProps> = ({ types, transaction }) => {
  const { type, timestamp, terraFinderUrl } = transaction;

  const price = transaction?.price;
  const currency = transaction?.currency;
  const buyer = transaction?.buyer;
  const seller = transaction?.seller;

  const shortSellerAddress = getShortText(seller || '', 6, 4);
  const shortBuyerAddress = getShortText(buyer || '', 6, 4);

  const sellerTerraFinderUrl = getTerraFinderUrl(seller || '');
  const buyerTerraFinderUrl = getTerraFinderUrl(buyer || '');

  const typeDetails = types.find((t) => t.value === type);

  return (
    <StyledTransaction>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
      >
        {typeDetails && (
          <StyledLabel>
            {typeDetails?.icon} {typeDetails?.label}
          </StyledLabel>
        )}
        {price && currency && (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <LazyLoadImage
              src={currency === 'LUNA' ? '/images/luna.svg' : '/images/ust.png'}
              alt={currency}
              width="16px"
              height="16px"
            />
            <Typography
              variant="h300"
              sx={{ color: 'text.primary', ml: 1, mr: 1 / 2 }}
              component="h6"
            >
              {formatDecimal(price)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              ${currency}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ alignItems: { md: 'center' } }}
        spacing={buyer && seller ? 1 : 0}
        divider={
          buyer &&
          seller && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}
            >
              •
            </Typography>
          )
        }
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center' }}
          spacing={1}
          divider={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
          }
        >
          {seller && buyer && (
            <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                from
              </Typography>
              <TypographyLink
                variant="h200"
                href={sellerTerraFinderUrl}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ color: 'text.primary', fontFamily: 'Inter, sans-serif' }}
              >
                {type === 'marketplace_post_buy_order' ? shortBuyerAddress : shortSellerAddress}
              </TypographyLink>
            </Stack>
          )}
          {buyer && seller && (
            <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                to
              </Typography>
              <TypographyLink
                variant="h200"
                href={buyerTerraFinderUrl}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ color: 'text.primary', fontFamily: 'Inter, sans-serif' }}
              >
                {type === 'marketplace_post_buy_order' ? shortSellerAddress : shortBuyerAddress}
              </TypographyLink>
            </Stack>
          )}
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {formatDistance(new Date(timestamp), new Date(), {
              addSuffix: true,
            })}
          </Typography>
          <TypographyLink
            href={terraFinderUrl}
            target="_blank"
            rel="noreferrer"
            sx={{
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ExternalLinkIcon
              fontSize="small"
              sx={{ fontSize: '18px !important' }}
            />
          </TypographyLink>
        </Stack>
      </Stack>
    </StyledTransaction>
  );
};

export default Transaction;
