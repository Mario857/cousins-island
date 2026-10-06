import Typography from '@mui/material/Typography';
import { StyledPrice } from './Checkout.styled';
import Stack from '@mui/material/Stack';
import Button from 'components/Button/Button';
import { CheckoutStep } from './BuyNow';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface CheckoutProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  formattedPrice: string;
}

const Checkout: React.FC<CheckoutProps> = ({
  setOpenModal,
  setStep,
  formattedPrice,
}) => {
  const { balance } = useSelector((state: State) => state.account);
  const { userTradingDetails } = useSelector((state: State) => state.token);

  const sellPriceCurrency = userTradingDetails?.sellPriceCurrency;

  const getFormattedBalance = () => {
    if (sellPriceCurrency) {
      if (sellPriceCurrency === 'LUNA') {
        return formatLUNADecimal(balance.luna);
      } else {
        return formatUSTDecimal(balance.ust);
      }
    }

    return '0';
  };

  const formattedBalance = getFormattedBalance();

  const details = [
    {
      name: 'Your balance',
      value: formattedBalance,
    },
    {
      name: 'You will pay',
      value: formattedPrice,
    },
    {
      name: 'Tx fee',
      value: '<1 UST',
    },
  ];

  return (
    <>
      <StyledPrice>
        <Typography variant="body3" sx={{ color: 'text.primary' }}>
          Price
        </Typography>
        <Typography variant="h300" component="h6" sx={{ color: 'text.primary' }}>
          {formattedPrice}
        </Typography>
      </StyledPrice>
      {details.map((detail, index) => (
        <Stack
          direction="row"
          key={`checkout-detail-${index}`}
          sx={{ alignItems: 'center', justifyContent: 'space-between', mb: index !== details.length - 1 ? 1 : 0 }}
        >
          <Typography variant="body3" sx={{ color: 'text.primary' }}>
            {detail.name}
          </Typography>
          <Typography variant="h300" component="h6" sx={{ color: 'text.primary' }}>
            {detail.value}
          </Typography>
        </Stack>
      ))}
      <Box sx={{ mt: 4 }}>
        <Grid
          container
          sx={{ alignItems: { md: 'center' } }}
          spacing={{ xs: 2, md: 4 }}
        >
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Button
              variant="contained"
              color="tertiary"
              type="button"
              fullWidth
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Button
              variant="contained"
              color="primary"
              type="button"
              fullWidth
              onClick={() => setStep('completing')}
            >
              Checkout
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Checkout;
