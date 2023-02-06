import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import { State } from 'store/store'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserTradeStatus } from '../Trade'
import TransferForm from './TransferForm'
import { TxReceipt } from 'utils/blockchain/blockchain.interface'
import TransferCompleted from './TransferCompleted'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import blockchainModule from 'utils/blockchain/blockchain'
import { updateUserTradingDetails } from 'store/actions/token'
import { getOwnedTokens } from 'store/actions/account'

interface TransferProps {
	userTradeStatus: UserTradeStatus
}

const Transfer: React.FC<TransferProps> = ({ userTradeStatus }) => {
	const [openModal, setOpenModal] = useState(false)
	const [completed, setCompleted] = useState(false)
	const [txReceipt, setTxReceipt] = useState<null | TxReceipt>(null)
	const [errorMessage, setErrorMessage] = useState('')

	const { tokenDetails, userTradingDetails } = useSelector(
		(state: State) => state.token
	)

	const tokenName = tokenDetails?.name
	const nftContractAddress = tokenDetails?.nftContractAddress
	const tokenId = tokenDetails?.tokenId

	const [transferredToAddress, setTranserredToAddress] = useState<null | string>(
		null
	)

	const dispatch = useDispatch()

	const handleSuccessBroadcast = () => {
		setCompleted(true)
		if (userTradingDetails) {
			dispatch(
				updateUserTradingDetails({
					...userTradingDetails,
					owner: transferredToAddress!,
					canUserSell: false,
					doesUserOwnIt: false,
				})
			)
		}
		dispatch(getOwnedTokens(nftContractAddress!) as any)
	}

	const { loading, setLoading } = useBroadcastingTx(
		txReceipt?.txId,
		handleSuccessBroadcast
	)

	const transferToken = async (userAddress: string) => {
		setLoading(loading => ({ ...loading, send: true }))

		try {
			const txReceipt = await blockchainModule.transferToken(
				nftContractAddress!,
				tokenId!,
				userAddress
			)
			setTxReceipt(txReceipt)
			setTranserredToAddress(userAddress)
		} catch (error) {
			console.log(error)
			if (txReceipt) setTxReceipt(null)
			setErrorMessage('There was an error while processing the transaction.')
		}

		setLoading(loading => ({ ...loading, send: false }))
	}

	return (
		<>
			{userTradeStatus === UserTradeStatus.CAN_SELL && (
				<Button
					variant='contained'
					color='tertiary'
					type='button'
					fullWidth
					sx={{ mt: 2 }}
					onClick={() => {
						if (completed) setCompleted(false)
						setOpenModal(true)
					}}
				>
					Transfer
				</Button>
			)}
			<Modal
				open={openModal}
				setOpen={setOpenModal}
				heading={!completed ? `Transfer ${tokenName}` : 'Congratulations'}
				description={
					!completed
						? `You will transfer your ${tokenName} to another user. Make sure you have the correct address and NFT.`
						: 'You transferred the item'
				}
				width={650}
			>
				{!completed ? (
					<TransferForm
						transferToken={transferToken}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
						loading={loading}
					/>
				) : (
					<TransferCompleted
						txReceipt={txReceipt}
						setTxReceipt={setTxReceipt}
						setOpenModal={setOpenModal}
					/>
				)}
			</Modal>
		</>
	)
}

export default Transfer
