import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Checkout from './Checkout'
import CompletingTransaction from './CompletingTransaction'
import PurchaseCompleted from './PurchaseCompleted'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { TxReceipt, TerraCurrency } from 'utils/blockchain/blockchain.interface'
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency'
import { UserTradeStatus } from '../Trade'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import blockchain from 'utils/blockchain/blockchain'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import { getBalance, updateOwnedTokens } from 'store/actions/account'
import { useWallet } from '@terra-money/wallet-provider'
import { updateUserTradingDetails } from 'store/actions/token'

export type CheckoutStep = 'checkout' | 'completing' | 'completed'

interface BuyNowProps {
	userTradeStatus: UserTradeStatus
}

const BuyNow: React.FC<BuyNowProps> = ({ userTradeStatus }) => {
	const [openModal, setOpenModal] = useState(false)
	const [step, setStep] = useState<CheckoutStep>('checkout')
	const [txReceipt, setTxReceipt] = useState<TxReceipt | null>(null)

	const { tokenDetails, userTradingDetails } = useSelector(
		(state: State) => state.token
	)
	const { ownedTokens } = useSelector((state: State) => state.account)
	const tokenName = tokenDetails?.name
	const sellPriceAmount = userTradingDetails?.sellPriceAmount
	const sellPriceCurrency = userTradingDetails?.sellPriceCurrency

	const dispatch = useDispatch()
	const [errorMessage, setErrorMessage] = useState('')

	const wallet = useWallet()

	const onSuccessBroadcast = async () => {
		if (userTradingDetails) {
			const updatedUserTradingDetails = {
				...userTradingDetails,
				canUserSell: true,
				canUserBuy: false,
				doesUserOwnIt: true,
				owner: wallet?.wallets[0]?.terraAddress,
			}
			dispatch(updateUserTradingDetails(updatedUserTradingDetails))
		}

		if (tokenDetails) {
			const nftContractAddress = tokenDetails.nftContractAddress

			if (ownedTokens?.[nftContractAddress]) {
				const updatedTokenDetails = {
					...tokenDetails,
					sellPriceAmount: undefined,
					sellPriceCurrency: undefined,
				}

				const updatedOwnedTokens = {
					[nftContractAddress]: [
						updatedTokenDetails,
						...ownedTokens[nftContractAddress],
					],
				}

				dispatch(updateOwnedTokens(updatedOwnedTokens))
			}
		}

		dispatch(getBalance() as any)

		setStep('completed')
	}

	const onFailedBroadcast = () => {
		setErrorMessage('Probably this NFT has already been purchased.')
	}

	const { setLoading, loading } = useBroadcastingTx(
		txReceipt?.txId,
		onSuccessBroadcast,
		onFailedBroadcast
	)

	const buyNow = async () => {
		setLoading(prevLoading => ({ ...prevLoading, send: true }))
		setErrorMessage('')

		if (tokenDetails && userTradingDetails) {
			try {
				const txReceipt = await blockchain.buyNow(
					tokenDetails.nftContractAddress,
					tokenDetails.tokenId,
					userTradingDetails.sellPriceAmount as number,
					userTradingDetails.sellPriceCurrency as TerraCurrency
				)
				setTxReceipt(txReceipt)
				setErrorMessage('')
			} catch (error) {
				// @ts-ignore:next-line
				const errorData = { error }
				// @ts-ignore:next-line
				const errorMessage = errorData.error.response.data.error
				// @ts-ignore:next-line
				console.log(errorMessage)
				errorMessage.includes('insufficient funds')
					? setErrorMessage(`You don't have enough funds`)
					: setErrorMessage('There was an error while processing the transaction.')
			}
		}

		setLoading(prevLoading => ({ ...prevLoading, send: false }))
	}

	const getFormattedPrice = () => {
		if (sellPriceCurrency) {
			return sellPriceCurrency === 'LUNA'
				? formatLUNADecimal(sellPriceAmount || (0 as number))
				: formatUSTDecimal(sellPriceAmount || (0 as number))
		}
		return '0'
	}

	const formattedPrice = getFormattedPrice()

	const getModalStepData = () => {
		switch (step) {
			case 'completing':
				return {
					children: (
						<CompletingTransaction
							txReceipt={txReceipt}
							loading={loading.send || loading.broadcasting}
							buyNow={buyNow}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
						/>
					),
					heading: 'Confirm the Trade',
					description: `Please confirm the transaction for ${formattedPrice}.`,
				}
			case 'completed':
				return {
					children: (
						<PurchaseCompleted
							txReceipt={txReceipt}
							setTxReceipt={setTxReceipt}
							setOpenModal={setOpenModal}
						/>
					),
					heading: 'Congratulations!',
					description: 'You successfully purchased item',
				}
			case 'checkout':
			default:
				return {
					children: (
						<Checkout
							setOpenModal={setOpenModal}
							setStep={setStep}
							formattedPrice={formattedPrice}
						/>
					),
					heading: 'Checkout',
					description: (
						<Typography
							variant='h200'
							color='text.primary'
							component='h6'
							display='inline-block'
						>
							You are about to purchase {tokenName}
						</Typography>
					),
				}
		}
	}

	const modalStepData = getModalStepData()

	const handleOpenModal = () => {
		setOpenModal(true)
		setTxReceipt(null)
		setStep('checkout')
	}

	return (
		<>
			{userTradeStatus === UserTradeStatus.CAN_BUY && (
				<Button
					type='button'
					variant='contained'
					color='primary'
					fullWidth
					onClick={handleOpenModal}
				>
					Buy Now
				</Button>
			)}
			<Modal
				open={openModal}
				setOpen={setOpenModal}
				closeAfterTransition
				width={547}
				heading={modalStepData.heading}
				description={modalStepData.description}
				allowClose={!loading.send && !loading.broadcasting}
			>
				{modalStepData.children}
			</Modal>
		</>
	)
}

export default BuyNow
