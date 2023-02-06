import Button from 'components/Button/Button'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import { useForm } from 'utils/useForm'
import React, { useState } from 'react'
import { TerraCurrency, TxReceipt } from 'utils/blockchain/blockchain.interface'
import blockchain from 'utils/blockchain/blockchain'
import TxResult from 'components/TxResult/TxResult'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import Withdraw from './Withdraw'
import { useDispatch } from 'react-redux'
import { getBalance, getDepositedBalance } from 'store/actions/account'
import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts'

interface DepositProps {
	currency: TerraCurrency
	balance: number
}

interface FormValues {
	amount: string
}

const Deposit: React.FC<DepositProps> = ({ currency, balance }) => {
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
			custom: {
				isValid: (value: string) => {
					return parseFloat(value) > 0
				},
				message: 'Please enter integer (over 0)',
			},
		},
	}

	const { values, handleChange, errors, resetValues, handleSubmit } =
		useForm<FormValues>({
			validations,
			initialValues: {
				amount: '',
			},
		})

	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [txReceipt, setTxReceipt] = useState<TxReceipt | null>(null)

	const dispatch = useDispatch()

	const onSuccessBroadcast = () => {
		dispatch(getBalance() as any)
		dispatch(getDepositedBalance() as any)

		resetValues()
	}

	const { loading, setLoading, loadingText } = useBroadcastingTx(
		txReceipt?.txId,
		onSuccessBroadcast
	)

	const onSubmit = async () => {
		setLoading(loading => ({ ...loading, send: true }))
		try {
			const txReceipt = await blockchain.depositTokensOnMarketplace(
				parseFloat(values.amount),
				currency
			)

			setTxReceipt(txReceipt)
			setSuccessMessage('You have successfully deposited your funds.')
			setErrorMessage('')
		} catch (error) {
			console.log(error)
			setSuccessMessage('')
			setErrorMessage('There was an error while processing the transaction.')
		}

		setLoading(loading => ({ ...loading, send: false }))
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<CurrencyInput
				currency={currency}
				label='Amount'
				value={values.amount}
				error={errors.amount}
				name='amount'
				onChange={handleChange}
			/>
			<SeparatedTexts left='Withdraw Fee' right='0.25 $UST' sx={{ mt: 2 }} />
			<Button
				variant='contained'
				color='primary'
				type='submit'
				fullWidth
				sx={{ mt: 3 }}
				disabled={Boolean(!values.amount || errors.amount)}
				loading={loading.send || loading.broadcasting}
				loadingIndicator={<LoadingSpinner />}
			>
				{loadingText ? loadingText : 'Deposit'}
			</Button>
			<Withdraw
				amount={values.amount}
				currency={currency}
				balance={balance}
				errors={errors}
				onSuccessBroadcast={onSuccessBroadcast}
			/>
			{(successMessage || errorMessage) && !loading.broadcasting && (
				<TxResult
					errorMessage={errorMessage}
					successMessage={successMessage}
					txReceipt={txReceipt}
					onSuccessClose={() => {
						setTxReceipt(null)
						setSuccessMessage('')
					}}
					onErrorClose={() => setErrorMessage('')}
					sx={{ mt: 3 }}
				/>
			)}
		</form>
	)
}

export default Deposit
