import CurrencyInput from 'components/CurrencyInput/CurrencyInput';
import Button from 'components/Button/Button';
import { useForm } from 'utils/useForm';
import CurrencySelector from 'components/CurrencySelector/CurrencySelector';
import {
  TerraCurrency,
  TxReceipt,
} from 'utils/blockchain/blockchain.interface';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import TxResult from 'components/TxResult/TxResult';
import React from 'react';
import Stack from '@mui/material/Stack';
import { View } from './PlaceBid';
import { State } from 'store/store';
import { useSelector } from 'react-redux';
import { toDecimal } from 'utils/currency';

interface FormValues {
  currency: TerraCurrency;
  amount: string;
}

interface DepositFundsFormProps {
  loading: {
    send: boolean;
    broadcasting: boolean;
  };
  loadingText: string | boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
  depositFunds: (amount: number, currency: TerraCurrency) => void;
  txReceipt: TxReceipt | null;
  setTxReceipt: React.Dispatch<React.SetStateAction<TxReceipt | null>>;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const DepositFundsForm: React.FC<DepositFundsFormProps> = ({
  loading,
  loadingText,
  errorMessage,
  setErrorMessage,
  setView,
  depositFunds,
  txReceipt,
  setTxReceipt,
  successMessage,
  setSuccessMessage,
}) => {
  const { balance } = useSelector((state: State) => state.account);

  const validations = {
    amount: {
      required: {
        value: true,
        message: 'Please enter integer (over 0)',
      },
      pattern: {
        value: '\\.[0-9]{3,}$',
        message: `Amount must be within 2 decimal points`,
      },
      min: {
        value: 0.01,
        message: 'Please enter integer (over 0)',
      },
      custom: {
        isValid: (value: string, values: FormValues) => {
          return (
            parseFloat(value) <=
            balance[values.currency === 'LUNA' ? 'luna' : 'ust']
          );
        },
        message: 'Insufficient balance',
      },
    },
  };

  const { values, handleChange, errors, setValue, handleSubmit, resetValues } =
    useForm<FormValues>({
      validations,
      initialValues: {
        currency: 'LUNA',
        amount: '',
      },
    });

  const onSubmit = async () => {
    depositFunds(parseFloat(values.amount), values.currency);
    resetValues();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CurrencySelector
        currency={values.currency}
        handleChange={(currency: TerraCurrency) => {
          setValue('currency', currency);
          setValue('amount', '');
        }}
      />
      <CurrencyInput
        label="Price"
        value={values.amount}
        onChange={handleChange}
        name="amount"
        error={values.amount && errors.amount}
        currency={values.currency}
        available={balance[values.currency === 'LUNA' ? 'luna' : 'ust']}
        onAvailableClick={() =>
          setValue(
            'amount',
            toDecimal(
              balance[values.currency === 'LUNA' ? 'luna' : 'ust']
            ).toString()
          )
        }
      />
      {(errorMessage || successMessage) &&
        !loading.broadcasting &&
        !loading.send && (
          <TxResult
            errorMessage={errorMessage}
            successMessage={successMessage}
            txReceipt={txReceipt}
            sx={{ mt: 2 }}
            onErrorClose={() => setErrorMessage('')}
            onSuccessClose={() => {
              setSuccessMessage('');
              setTxReceipt(null);
            }}
          />
        )}
      <Stack direction="row" spacing={3} mt={3}>
        <Button
          variant="contained"
          color="tertiary"
          type="button"
          fullWidth
          disabled={loading.broadcasting || loading.send}
          onClick={() => {
            setView(View.POST_BID);
            setSuccessMessage('');
            setErrorMessage('');
            setTxReceipt(null);
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          loading={loading.broadcasting || loading.send}
          loadingIndicator={<LoadingSpinner />}
          disabled={Boolean(
            errors.amount || !values.amount || !values.currency
          )}
        >
          {loadingText || 'Deposit'}
        </Button>
      </Stack>
    </form>
  );
};

export default DepositFundsForm;
