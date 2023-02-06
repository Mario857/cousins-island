import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

interface BuyFormModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BuyFormModal: React.FC<BuyFormModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const details = [
    {
      name: 'Case name',
      value: 'The name of the chest',
    },
    {
      name: 'Price of one case',
      value: '100.00 UST',
    },
    {
      name: 'Quantity cases',
      value: '1x',
    },
    {
      name: 'Tx fee',
      value: '0.23 UST',
    },
    {
      name: 'Summary',
      value: '100.23 UST',
    },
  ];

  return (
    <Modal
      open={openModal}
      setOpen={setOpenModal}
      closeAfterTransition
      width={608}
    >
      <>
        <Typography variant="body2" color="text.primary" component="p" mb={3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        {details.map((detail, index) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            key={`purchase-box-detail-${index}`}
            mb={index !== details.length - 2 ? 1 : 3}
          >
            <Typography variant="body2" color="text.primary">
              {detail.name}
            </Typography>
            <Typography variant="h200" color="text.primary" component="h6">
              {detail.value}
            </Typography>
          </Stack>
        ))}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 3 }}
        >
          Buy
        </Button>
      </>
    </Modal>
  );
};

export default BuyFormModal;
