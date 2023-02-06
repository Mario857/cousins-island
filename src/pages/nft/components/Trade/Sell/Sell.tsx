import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts'
import Stack from '@mui/material/Stack'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import CompletingTransaction from './CompletingTransaction'
import TransactionCompleted from './TransactionCompleted'
import { State } from 'store/store'
import { useDispatch, useSelector } from 'react-redux'
import { TerraCurrency, TxReceipt } from 'utils/blockchain/blockchain.interface'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import blockchain from 'utils/blockchain/blockchain'
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency'
import { useForm } from 'utils/useForm'
import Select from 'components/Select/Select'
import MenuItem from 'components/MenuItem/MenuItem'
import Box from '@mui/material/Box'
import { updateUserTradingDetails } from 'store/actions/token'
import {
	getBalance,
	updateOnSaleTokens,
	updateOwnedTokens,
} from 'store/actions/account'
import { UserTradeStatus } from '../Trade'
import CurrencySelector from 'components/CurrencySelector/CurrencySelector'

export type SellStep = 'completing' | 'completed'

interface Form {
	price: string
	currency: TerraCurrency
}

interface SellProps {
	userTradeStatus: UserTradeStatus
}

const Sell: React.FC<SellProps> = ({ userTradeStatus }) => {
	const [openModal, setOpenModal] = useState(false)
	const [step, setStep] = useState<SellStep>('completing')
	const { tokenDetails, userTradingDetails } = useSelector(
		(state: State) => state.token
	)
	const { onSaleTokens, ownedTokens } = useSelector(
		(state: State) => state.account
	)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const token = tokenDetails

	const validations = {
		price: {
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

	const { values, handleChange, errors, setValue, resetValues } = useForm<Form>({
		validations,
		initialValues: {
			price: '',
			currency: 'LUNA',
		},
	})

	const prepareAmountAfterFees = () => {
		let luartFee = 0,
			royaltyFee = 0

		if (userTradingDetails?.sellFees.luartFee != null) {
			luartFee = parseFloat(
				userTradingDetails?.sellFees.luartFee.substring(
					0,
					userTradingDetails?.sellFees.luartFee.length - 1
				)
			)
		}

		if (userTradingDetails?.sellFees.royaltyFee != null) {
			royaltyFee = parseFloat(
				userTradingDetails?.sellFees.royaltyFee.substring(
					0,
					userTradingDetails?.sellFees.royaltyFee.length - 1
				)
			)
		}

		let amountFees: number = 0.0

		if (values.price) {
			amountFees =
				parseFloat(values.price) * ((100 - (luartFee + royaltyFee)) / 100)
		}

		return amountFees.toString()
	}

	const getFormattedPrice = (price: string) => {
		return values.currency === 'LUNA'
			? formatLUNADecimal(price || 0)
			: formatUSTDecimal(price || 0)
	}

	const [txReceipt, setTxReceipt] = useState<TxReceipt | null>(null)

	const dispatch = useDispatch()

	const onSuccessBroadcast = async () => {
		if (userTradingDetails) {
			const updatedUserTradingDetails = {
				...userTradingDetails,
				sellPriceAmount: parseFloat(values.price),
				sellPriceCurrency: values.currency as TerraCurrency,
				canUserSell: false,
			}
			dispatch(updateUserTradingDetails(updatedUserTradingDetails))
		}

		if (tokenDetails) {
			if (onSaleTokens) {
				const updatedTokenDetails = {
					...tokenDetails,
					sellPriceAmount: parseFloat(values.price),
					sellPriceCurrency: values.currency as TerraCurrency,
				}
				dispatch(updateOnSaleTokens([updatedTokenDetails, ...onSaleTokens]))
			}

			const nftContractAddress = tokenDetails.nftContractAddress

			if (ownedTokens?.[nftContractAddress]) {
				const updatedOwnedTokens = {
					[nftContractAddress]: ownedTokens[nftContractAddress].filter(
						ownedToken => ownedToken.tokenId !== tokenDetails.tokenId
					),
				}

				dispatch(updateOwnedTokens(updatedOwnedTokens))
			}
		}

		dispatch(getBalance() as any)

		setStep('completed')
		resetValues()
	}

	const { loading, setLoading, loadingText } = useBroadcastingTx(
		txReceipt?.txId,
		onSuccessBroadcast
	)

	const handleSell = async (e: React.MouseEvent<HTMLElement>) => {
		setLoading(prevLoading => ({ ...prevLoading, send: true }))

		if (token) {
			try {
				const { nftContractAddress, tokenId } = token
				const txReceipt = await blockchain.offerSellPrice(
					nftContractAddress,
					tokenId,
					parseFloat(values.price),
					values.currency as TerraCurrency
				)
				setTxReceipt(txReceipt)
				setSuccessMessage(
					`You put it up for sale ${token?.name} for ${getFormattedPrice(
						values.price
					)}.`
				)
				setErrorMessage('')
			} catch (error) {
				console.log(error)
				setSuccessMessage('')
				setErrorMessage('There was an error while processing the transaction.')
			}
		}

		setLoading(prevLoading => ({ ...prevLoading, send: false }))
	}

	const getModalData = () => {
		switch (step) {
			case 'completed':
				return {
					children: (
						<TransactionCompleted
							txReceipt={txReceipt}
							setTxReceipt={setTxReceipt}
							successMessage={successMessage}
							setOpenModal={setOpenModal}
						/>
					),
					heading: 'You have successfully listed the item for sale',
				}
			case 'completing':
			default:
				return {
					children: (
						<CompletingTransaction
							formattedPrice={getFormattedPrice(values.price)}
							setOpenModal={setOpenModal}
							loadingText={loadingText}
							loading={loading.send || loading.broadcasting}
							handleSell={handleSell}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							currency={values.currency}
							price={Number(values.price)}
							amountAfterSold={getFormattedPrice(prepareAmountAfterFees())}
						/>
					),
					heading: `Are you sure you want to sell ${token?.name}?`,
				}
		}
	}

	const modalData = getModalData()

	const isButtonDisabled = Boolean(
		errors.price || !values.price || !values.currency
	)

	useEffect(() => {
		setValue('price', '')
	}, [values.currency])

	return (
		<>
			{userTradeStatus === UserTradeStatus.CAN_SELL && (
				<>
					<CurrencySelector
						label='Payment currency'
						currency={values.currency}
						handleChange={(currency: TerraCurrency) => setValue('currency', currency)}
					/>
					<CurrencyInput
						label='Item price'
						value={values.price}
						onChange={handleChange}
						name='price'
						error={values.price && errors.price}
						currency={values.currency}
					/>
					{/* <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
        You bought the item for $LUNA 3.34
      </Typography> */}
					{/* <DateInput label="Auction end date" />
      <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
        Your auction will end in 3 Day
      </Typography> */}
					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							setOpenModal(true)
							setStep('completing')
						}}
						type='button'
						fullWidth
						sx={{ mt: 2 }}
						disabled={isButtonDisabled}
					>
						Sell
					</Button>
					{/* <Button variant="contained" color="tertiary" type="button" fullWidth>
        Transfer
      </Button> */}
				</>
			)}
			<Modal
				heading={modalData.heading}
				open={openModal}
				setOpen={setOpenModal}
				closeAfterTransition
				width={707}
				variant='secondary'
				allowClose={!loading.broadcasting && !loading.send}
			>
				{modalData.children}
			</Modal>
		</>
	)
}

export default Sell
