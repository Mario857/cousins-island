import Button from 'components/Button/Button'
import { TxReceipt } from 'utils/blockchain/blockchain.interface'
import Modal from 'components/Modal/Modal'
import CompletingTransaction from './CompletingTransaction'
import CancelSellingCompleted from './CancelSellingCompleted'
import { UserTradeStatus } from '../Trade'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import blockchain from 'utils/blockchain/blockchain'
import { updateUserTradingDetails } from 'store/actions/token'
import {
	getBalance,
	updateOnSaleTokens,
	updateOwnedTokens,
} from 'store/actions/account'
import { State } from 'store/store'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AcceptOfferModal from '../AcceptOfferModal/AcceptOfferModal'

export type CancelSellingStep = 'completing' | 'completed'

interface CancelSellingProps {
	userTradeStatus: UserTradeStatus
}

const CancelSelling: React.FC<CancelSellingProps> = ({ userTradeStatus }) => {
	const [txReceipt, setTxReceipt] = useState<TxReceipt | null>(null)
	const [step, setStep] = useState<CancelSellingStep>('completing')
	const [openModal, setOpenModal] = useState(false)

	const { tokenDetails, userTradingDetails, bids } = useSelector(
		(state: State) => state.token
	)
	const { onSaleTokens, ownedTokens } = useSelector(
		(state: State) => state.account
	)

	const tokenId = tokenDetails?.tokenId || ''
	const nftContractAddress = tokenDetails?.nftContractAddress || ''

	const [errorMessage, setErrorMessage] = useState('')

	const dispatch = useDispatch()

	const onSuccessBroadcast = () => {
		if (userTradingDetails) {
			const updatedUserTradingDetails = {
				...userTradingDetails,
				sellPriceAmount: undefined,
				sellPriceCurrency: undefined,
				canUserSell: true,
			}

			dispatch(updateUserTradingDetails(updatedUserTradingDetails))
		}

		if (tokenDetails) {
			if (onSaleTokens) {
				const updatedOnSaleTokens = onSaleTokens.filter(
					onSaleToken => onSaleToken.tokenId !== tokenDetails.tokenId
				)
				dispatch(updateOnSaleTokens(updatedOnSaleTokens))
			}

			const nftContractAddress = tokenDetails.nftContractAddress

			if (ownedTokens?.[nftContractAddress]) {
				const updatedOwnedTokens = {
					[nftContractAddress]: [tokenDetails, ...ownedTokens[nftContractAddress]],
				}

				dispatch(updateOwnedTokens(updatedOwnedTokens))
			}
		}

		dispatch(getBalance() as any)

		setStep('completed')
	}

	const { loading, setLoading, loadingText } = useBroadcastingTx(
		txReceipt?.txId,
		onSuccessBroadcast
	)

	const cancelSelling = async () => {
		setLoading(prevLoading => ({ ...prevLoading, send: true }))

		try {
			const txReceipt = await blockchain.cancelSelling(nftContractAddress, tokenId)
			setTxReceipt(txReceipt)
			setErrorMessage('')
		} catch (error) {
			console.log(error)
			setErrorMessage('There was an error while processing the transaction.')
			setLoading(prevLoading => ({ ...prevLoading, send: false }))
		}
	}

	const getModalStepData = () => {
		if (step === 'completed') {
			return {
				heading: 'You just successfully cancelled the sale',
				children: (
					<CancelSellingCompleted
						txReceipt={txReceipt}
						setTxReceipt={setTxReceipt}
						setOpenModal={setOpenModal}
					/>
				),
			}
		} else {
			return {
				heading: 'Are you sure you want to cancel?',
				children: (
					<CompletingTransaction
						setOpenModal={setOpenModal}
						loading={loading.broadcasting || loading.send}
						loadingText={loadingText}
						cancelSelling={cancelSelling}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				),
			}
		}
	}

	const modalStepData = getModalStepData()

	const [openAcceptOfferModal, setOpenAcceptOfferModal] = useState(false)

	const highestBid = bids?.highestToLowest?.[0] || null

	return (
		<>
			{userTradeStatus === UserTradeStatus.CAN_CANCEL_SELLING && (
				<>
					<Button
						variant='contained'
						color='primary'
						fullWidth
						type='button'
						onClick={() => {
							setOpenModal(true)
							setStep('completing')
							setTxReceipt(null)
						}}
					>
						Cancel Sale
					</Button>
					{highestBid && (
						<Button
							variant='contained'
							color='tertiary'
							fullWidth
							type='button'
							sx={{ mt: 2 }}
							onClick={() => setOpenAcceptOfferModal(true)}
						>
							Accept Highest Bid
						</Button>
					)}
				</>
			)}
			<AcceptOfferModal
				openModal={openAcceptOfferModal}
				setOpenModal={setOpenAcceptOfferModal}
				selectedBid={highestBid}
			/>
			<Modal
				open={openModal}
				setOpen={setOpenModal}
				heading={modalStepData.heading}
				width={707}
				allowClose={!loading.send && !loading.broadcasting}
			>
				{modalStepData.children}
			</Modal>
		</>
	)
}

export default CancelSelling
