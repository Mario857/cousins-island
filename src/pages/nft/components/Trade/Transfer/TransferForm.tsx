import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import TxResult from 'components/TxResult/TxResult';
import { useForm } from 'utils/useForm';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface FormValues {
  userAddress: string;
}

interface TransferFormProps {
  transferToken: (userAddress: string) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: {
    broadcasting: boolean;
    send: boolean;
  };
}

const TransferForm: React.FC<TransferFormProps> = ({
  transferToken,
  errorMessage,
  setErrorMessage,
  loading,
}) => {
  const { values, handleChange, handleSubmit } = useForm<FormValues>({
    initialValues: { userAddress: '' },
  });

  const onSubmit = () => transferToken(values.userAddress);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading.send || loading.broadcasting ? (
        <Stack direction="row" alignItems="center" spacing="20px" mb={1}>
          <LoadingSpinner color="secondary" size="large" />
          <div>
            <Typography
              variant="h400"
              color="text.primary"
              component="h5"
              mb="4px"
            >
              Transfer
            </Typography>
            <Typography variant="body3" color="text.primary" component="p">
              Confirm the transaction on your wallet
            </Typography>
          </div>
        </Stack>
      ) : (
        <Input
          value={values.userAddress}
          name="userAddress"
          onChange={handleChange}
          placeholder="terra1xf38ehunsr7ssf4qc0qgehvxkw5jxfz4sq90h2"
          label="Terra Wallet"
        />
      )}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ mt: 3 }}
        disabled={!values.userAddress || loading.send || loading.broadcasting}
      >
        {loading.send || loading.broadcasting ? 'In progress...' : 'Transfer'}
      </Button>
      {errorMessage && (
        <TxResult
          errorMessage={errorMessage}
          onErrorClose={() => setErrorMessage('')}
          sx={{ mt: 3 }}
        />
      )}
    </form>
  );
};

export default TransferForm;
