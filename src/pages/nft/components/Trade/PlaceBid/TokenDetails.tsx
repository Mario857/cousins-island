import { State } from 'store/store';
import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import TokenMedia from 'components/TokenMedia/TokenMedia';
import Typography from '@mui/material/Typography';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import Heading from 'components/Heading/Heading';
import Price from 'components/Price/Price';
import Box from '@mui/material/Box';

const TokenDetails = () => {
  const { tokenDetails, userTradingDetails, collection, bids } = useSelector(
    (state: State) => state.token
  );

  const { title, isExclusive } = collection!;

  const { name, imageURL } = tokenDetails!;

  const sellPriceAmount = userTradingDetails?.sellPriceAmount;
  const sellPriceCurrency = userTradingDetails?.sellPriceCurrency;

  const highestBid = bids?.highestToLowest?.[0];

  return (
    <Stack
      direction="row"
      spacing={3}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box width="114px">
        <TokenMedia src={imageURL} alt={name} width="114px" height="114px" />
      </Box>
      <Stack width="100%" direction="column" justifyContent="space-between">
        <div>
          <Typography variant="body3" color="text.secondary">
            {title}{' '}
            <ExclusiveMark
              isExclusive={Boolean(isExclusive)}
              sx={{ ml: '4px' }}
            />
          </Typography>
          <Heading variant="h400" component="h4" mb={1}>
            {name}
          </Heading>
        </div>
        {sellPriceAmount && sellPriceCurrency && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              display="block"
              mb={{ xs: 1 / 2, md: 0 }}
            >
              Price
            </Typography>
            <Price currency={sellPriceCurrency} amount={sellPriceAmount} />
          </Stack>
        )}
        {highestBid && highestBid?.currency && highestBid?.amount && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              display="block"
              mb={{ xs: 1 / 2, md: 0 }}
            >
              Highest offer
            </Typography>
            <Price
              currency={highestBid?.currency}
              amount={highestBid?.amount}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default TokenDetails;
