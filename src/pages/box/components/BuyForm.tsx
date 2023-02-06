import CountInput from 'components/CountInput/CountInput';
import { useState } from 'react';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import { Typography } from '@mui/material';
import BuyFormModal from './BuyFormModal';

const BuyForm = () => {
  const [count, setCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.value === '') value = '0';

    setCount(parseInt(value));
  };

  return (
    <form>
      <CountInput
        value={count}
        onChange={handleChange}
        placeholder="0"
        handleDecrement={handleDecrement}
        handleIncrement={handleIncrement}
        count={count}
        min={1}
      />
      <Button
        variant="contained"
        color="primary"
        type="button"
        fullWidth
        disabled={count < 1}
        sx={{ mt: 2 }}
        onClick={() => setOpenModal(true)}
      >
        Buy
      </Button>
      <BuyFormModal openModal={openModal} setOpenModal={setOpenModal} />
    </form>
  );
};

export default BuyForm;
