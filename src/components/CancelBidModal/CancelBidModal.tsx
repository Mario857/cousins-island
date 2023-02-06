import React, { useState } from 'react'
import Modal from 'components/Modal/Modal'
import Cancel from './Cancel'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import blockchainModule from 'utils/blockchain/blockchain'
import SuccessfullTokenModalAction from 'components/SuccessfullTokenModalAction/SuccessfullTokenModalAction'
import { useDispatch, useSelector } from 'react-redux'
import { Bid, TxReceipt } from 'utils/blockchain/blockchain.interface'
import { State } from 'store/store'
import { removeBidFromTokenBids } from 'store/actions/token'
import { removeBidFromUserBids } from 'store/actions/account'

interface CancelBidModal {
	openModal: boolean
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
	canceled: boolean
	setCanceled: React.Dispatch<React.SetStateAction<boolean>>
	bid: Bid | null
}

const CancelBidModal: React.FC<CancelBidModal> = ({
	openModal,
	setOpenModal,
	canceled,
	setCanceled,
	bid,
}) => {
	const tokenDetails = bid?.tokenDetails
	const bidOrderId = bid?.bidOrderId || ''

	const { bids: tokenBids } = useSelector((state: State) => state.token)
	const { bids: userBids } = useSelector((state: State) => state.account)

	const dispatch = useDispatch()

	const [txReceipt, setTxReceipt] = useState<null | TxReceipt>(null)
	const [errorMessage, setErrorMessage] = useState('')

	const handleSuccessBroadcast = () => {
		setCanceled(true)

		if (userBids && userBids?.length > 0) {
			dispatch(removeBidFromUserBids(bidOrderId))
		}

		if (tokenBids?.highestToLowest && tokenBids?.highestToLowest?.length > 0) {
			dispatch(
				removeBidFromTokenBids(bidOrderId, tokenBids?.highestToLowest!) as any
			)
		}
	}

	const { loading, setLoading, loadingText } = useBroadcastingTx(
		txReceipt?.txId,
		handleSuccessBroadcast
	)

	const cancelBid = async () => {
		setLoading(loading => ({ ...loading, send: true }))
		try {
			const txReceipt = await blockchainModule.cancelBid(bidOrderId)
			setTxReceipt(txReceipt)
			setErrorMessage('')
		} catch (error) {
			console.log(error)
			setErrorMessage('There was an error while processing the transaction.')
		}
		setLoading(loading => ({ ...loading, send: false }))
	}

	const handleClose = () => {
		setOpenModal(false)
		setCanceled(false)
		setTxReceipt(null)
		setErrorMessage('')
	}

	return (
		<Modal
			heading={
				!canceled
					? 'Are you sure you want cancel your offer?'
					: 'You just successfully cancelled your offer'
			}
			open={openModal}
			setOpen={setOpenModal}
			closeAfterTransition
			width={707}
			variant='secondary'
			allowClose={!loading.send && !loading.broadcasting}
		>
			{!canceled ? (
				<Cancel
					selectedBid={bid}
					setOpenModal={setOpenModal}
					cancelBid={cancelBid}
					loading={loading}
					loadingText={loadingText}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			) : (
				<SuccessfullTokenModalAction
					txReceipt={txReceipt}
					setTxReceipt={setTxReceipt}
					onCloseModal={handleClose}
					tokenDetails={tokenDetails}
				/>
			)}
		</Modal>
	)
}

export default CancelBidModal
