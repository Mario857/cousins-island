import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import Button from 'components/Button/Button'
import { useForm } from 'utils/useForm'
import CurrencySelector from 'components/CurrencySelector/CurrencySelector'
import {
	Balance as IBalance,
	TerraCurrency,
} from 'utils/blockchain/blockchain.interface'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import TxResult from 'components/TxResult/TxResult'
import React from 'react'
import Stack from '@mui/material/Stack'
import Balance from './Balance'
import { View } from './PlaceBid'
import { formatLUNADecimal, formatUSTDecimal, toDecimal } from 'utils/currency'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { State } from 'store/store'
import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts'
import { getLunaPrice } from 'store/actions/statistics'
import Alert from 'components/Alert/Alert'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextButton from 'components/Button/TextButton'

interface FormValues {
	currency: TerraCurrency
	amount: string
}

interface OfferFormProps {
	postBid: (amount: number, currency: TerraCurrency) => void
	loading: {
		send: boolean
		broadcasting: boolean
	}
	loadingText: string | boolean
	errorMessage: string
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>
	balance: IBalance | null
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
	setView: React.Dispatch<React.SetStateAction<View>>
	sellPrice: number
	sellCurrency: string
}

const OfferForm: React.FC<OfferFormProps> = ({
	postBid,
	loading,
	loadingText,
	errorMessage,
	setErrorMessage,
	balance,
	setOpenModal,
	setView,
	sellPrice,
	sellCurrency,
}) => {
	const { highestBidAmount } = useSelector((state: State) => state.token)

	const { statisticsLoaders, lunaPrice } = useSelector(
		(state: State) => state.statistics
	)

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
			custom: (value: string, values: FormValues) => {
				const amount = parseFloat(value)

				if (amount > (balance?.[values.currency] || 0)) {
					return {
						isValid: false,
						message: 'Insufficient  balance',
					}
				}

				if (highestBidAmount.luna && highestBidAmount.ust) {
					if (values.currency === 'LUNA' && amount <= highestBidAmount.luna) {
						return {
							isValid: false,
							message: `Your bid must be greater than ${formatLUNADecimal(
								highestBidAmount.luna
							)} (${formatUSTDecimal(highestBidAmount.ust)})`,
						}
					}

					if (values.currency === 'UST' && amount <= highestBidAmount.ust) {
						return {
							isValid: false,
							message: `Your bid must be greater than ${formatUSTDecimal(
								highestBidAmount.ust
							)} (${formatLUNADecimal(highestBidAmount.luna)})`,
						}
					}
				}

				if (!isAvailable) {
					return {
						isValid: false,
						message: 'Insufficient  balance',
					}
				}

				return {
					isValid: true,
					message: '',
				}
			},
		},
	}

	const { values, handleChange, errors, setValue, handleSubmit } =
		useForm<FormValues>({
			validations,
			initialValues: {
				currency: 'LUNA',
				amount: '',
			},
		})

	const onSubmit = () => {
		postBid(parseFloat(values.amount), values.currency)
	}

	const dispatch = useDispatch()
	const [isHalfPrice, setIsHalfPrice] = useState(false)
	const [isBidMoreHalf, setIsBidMoreHalf] = useState(true)
	const [open, setOpen] = React.useState(true)
	const [openAvailable, setOpenAvailable] = React.useState(true)
	const [isAvailable, setIsAvailable] = useState(false)

	const checkIfPriceIsHalf = () => {
		if (
			lunaPrice &&
			values.amount &&
			values.currency &&
			sellPrice &&
			sellCurrency
		) {
			let halfPrice
			if (sellCurrency === 'UST') {
				halfPrice = sellPrice / 2
			} else {
				halfPrice = (sellPrice * lunaPrice) / 2
			}

			if (values.currency === 'UST') {
				if (highestBidAmount.ust) {
					setIsHalfPrice(halfPrice < highestBidAmount.ust)
					setIsBidMoreHalf(halfPrice < highestBidAmount.ust)
				} else {
					setIsBidMoreHalf(false)
				}
			} else {
				if (highestBidAmount.luna) {
					setIsHalfPrice(halfPrice < highestBidAmount.luna * lunaPrice)
					setIsBidMoreHalf(halfPrice < highestBidAmount.luna * lunaPrice)
				} else {
					setIsBidMoreHalf(false)
				}
			}

			if (!isBidMoreHalf) {
				const inputAmount = Number(values.amount)

				if (values.currency === 'UST') {
					setIsHalfPrice(inputAmount >= halfPrice)
				} else {
					const amountInUst = inputAmount * lunaPrice
					setIsHalfPrice(amountInUst >= halfPrice)
				}
			}
		}
	}

	useEffect(() => {
		if (!statisticsLoaders?.getLunaPrice) {
			dispatch(getLunaPrice() as any)
		}
	}, [dispatch])

	useEffect(() => {
		const amount = Number(values.amount)
		if (balance?.[values.currency]) {
			setIsAvailable(amount <= balance?.[values.currency])
			setOpenAvailable(amount > balance?.[values.currency])
		}
	}, [values.amount])

	useEffect(() => {
		setOpen(true)
		if (
			lunaPrice &&
			values.amount &&
			values.currency &&
			sellPrice &&
			sellCurrency
		) {
			checkIfPriceIsHalf()
		}
	}, [values.amount, values.currency])

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<CurrencySelector
				currency={values.currency}
				handleChange={(currency: TerraCurrency) => {
					setValue('currency', currency)
					setValue('amount', '')
				}}
			/>
			<Balance setView={setView} currency={values.currency} />
			<CurrencyInput
				label='Your Bid'
				value={values.amount}
				onChange={handleChange}
				name='amount'
				error={values.amount && errors.amount}
				currency={values.currency}
				available={balance ? balance?.[values.currency] : 0}
				onAvailableClick={() => {
					setValue('amount', toDecimal(balance?.[values.currency] || 0).toString())
				}}
				onHalfPriceClick={() => {
					let halfPrice
					if (values.currency === 'UST' && lunaPrice) {
						if (sellCurrency === 'UST') {
							halfPrice = sellPrice / 1.995
						} else {
							halfPrice = (sellPrice * lunaPrice) / 1.995
						}
						setValue('amount', toDecimal(halfPrice).toString())
					}
					if (values.currency === 'LUNA' && lunaPrice) {
						if (sellCurrency === 'LUNA') {
							halfPrice = sellPrice / 1.995
						} else {
							halfPrice = sellPrice / lunaPrice / 1.995
						}
						setValue('amount', toDecimal(halfPrice).toString())
					}
				}}
				lunaPrice={Number(lunaPrice)}
				sellPrice={sellPrice}
				sellCurrency={sellCurrency}
				isHalfPrice={isHalfPrice}
				isBidMoreHalf={isBidMoreHalf}
			/>
			{!isHalfPrice && values.amount && open && !isBidMoreHalf && (
				<Alert
					severity='warning'
					sx={{ my: 3 }}
					title='You are bidding below 50% of sale amount'
					action={
						<IconButton
							aria-label='close'
							color='inherit'
							size='small'
							onClick={() => {
								setOpen(false)
							}}
						>
							<CloseIcon fontSize='inherit' />
						</IconButton>
					}
				/>
			)}
			{!isAvailable && values.amount && openAvailable && (
				<Alert
					severity='error'
					sx={{ my: 3 }}
					title="You don't have enough funds in your luart wallet. "
					action={
						<TextButton
							color='light'
							type='button'
							size='medium'
							sx={{ display: { xs: 'none', sm: 'block' } }}
							onClick={() => setView(View.DEPOSIT_FUNDS)}
						>
							Deposit funds
						</TextButton>
					}
				/>
			)}
			<SeparatedTexts left='Bidding Fee' right='0.1 $UST' sx={{ mt: 3 }} />
			{errorMessage && (
				<TxResult
					errorMessage={errorMessage}
					sx={{ mt: 3 }}
					onErrorClose={() => setErrorMessage('')}
				/>
			)}
			<Stack direction='row' spacing={3} mt={3}>
				<Button
					variant='contained'
					color='tertiary'
					type='button'
					fullWidth
					onClick={() => setOpenModal(false)}
					disabled={loading.broadcasting || loading.send}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='primary'
					type='submit'
					fullWidth
					loading={loading.broadcasting || loading.send}
					loadingIndicator={<LoadingSpinner />}
					disabled={Boolean(
						errors.amount ||
							!values.amount ||
							!values.currency ||
							!isHalfPrice ||
							!isAvailable
					)}
				>
					{loadingText || 'Make offer'}
				</Button>
			</Stack>
		</form>
	)
}

export default OfferForm
