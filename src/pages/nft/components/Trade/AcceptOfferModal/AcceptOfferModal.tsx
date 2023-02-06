import React, { useState, useEffect } from 'react'
import Modal from 'components/Modal/Modal'
import Button from 'components/Button/Button'
import SeparatedTexts from 'components/SeparatedTexts/SeparatedTexts'
import { Bid, TxReceipt } from 'utils/blockchain/blockchain.interface'
import { getShortText } from 'utils/getShortText'
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency'
import Stack from '@mui/material/Stack'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import blockchainModule from 'utils/blockchain/blockchain'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import TxResult from 'components/TxResult/TxResult'
import { useSelector, useDispatch } from 'react-redux'
import { State } from 'store/store'
import {
	getAllBidsForToken,
	updateUserTradingDetails,
} from 'store/actions/token'
import { getBalance } from 'store/actions/account'
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark'
import blockchain from 'utils/blockchain/real/luart-api'
import Alert from 'components/Alert/Alert'
import { getLunaPrice } from 'store/actions/statistics'

interface AcceptOfferModalProps {
	openModal: boolean
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
	selectedBid: Bid | null
}

const AcceptOfferModal: React.FC<AcceptOfferModalProps> = ({
	openModal,
	setOpenModal,
	selectedBid,
}) => {
	const [soldSuccessfully, setSoldSuccessfully] = useState(false)

	const shortCreatorAddress = getShortText(selectedBid?.creatorAddress || '', 6)

	const { userTradingDetails, tokenDetails, collection } = useSelector(
		(state: State) => state.token
	)

	const { statisticsLoaders, lunaPrice } = useSelector(
		(state: State) => state.statistics
	)

	const currency = selectedBid?.currency
	const amount = selectedBid?.amount

	const tokenId = tokenDetails?.tokenId
	const nftContractAddress = tokenDetails?.nftContractAddress

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

		if (amount) {
			amountFees = amount * ((100 - (luartFee + royaltyFee)) / 100)
		}

		return amountFees
	}

	const [txReceipt, setTxReceipt] = useState<null | TxReceipt>(null)
	const [errorMessage, setErrorMessage] = useState('')

	const dispatch = useDispatch()

	const handleSuccesBroadcast = () => {
		setSoldSuccessfully(true)

		dispatch(getAllBidsForToken(nftContractAddress!, tokenId!) as any)

		if (userTradingDetails) {
			const updatedUserTradingDetails = {
				...userTradingDetails,
				owner: selectedBid?.creatorAddress || '',
				sellPriceCurrency: undefined,
				sellPriceAmount: undefined,
				doesUserOwnIt: false,
			}

			dispatch(updateUserTradingDetails(updatedUserTradingDetails))
		}

		dispatch(getBalance() as any)
	}

	const { loading, setLoading, loadingText } = useBroadcastingTx(
		txReceipt?.txId,
		handleSuccesBroadcast
	)

	const executeBid = async () => {
		setLoading(loading => ({ ...loading, send: true }))

		try {
			const txReceipt = await blockchainModule.executeBid(selectedBid?.bidOrderId!)
			setTxReceipt(txReceipt)

			setErrorMessage('')
		} catch (error) {
			console.log(error)
			setErrorMessage('There was an error while processing the transaction.')
		}
		setLoading(loading => ({ ...loading, send: false }))
	}

	const [belowFloor, setBelowFloor] = React.useState(false)
	const [floorPrice, setFloorPrice] = React.useState<null | number>(null)

	const getFloorPrice = async () => {
		if (nftContractAddress != null) {
			const floorPrice = await blockchain.getFloorPriceInCollection(
				nftContractAddress
			)

			setFloorPrice(floorPrice)
		}
	}

	const checkIfPriceIsBelowFloor = () => {
		if (floorPrice && lunaPrice && amount) {
			if (currency === 'UST') {
				const floorPriceInUst = floorPrice * lunaPrice
				setBelowFloor(amount < floorPriceInUst)
			} else {
				setBelowFloor(amount < floorPrice)
			}
		}
	}

	useEffect(() => {
		if (!statisticsLoaders?.getLunaPrice) {
			dispatch(getLunaPrice() as any)
		}
	}, [dispatch])

	useEffect(() => {
		if (amount) {
			getFloorPrice()
		}

		if (amount && floorPrice && lunaPrice) {
			checkIfPriceIsBelowFloor()
		}
	}, [amount, floorPrice, lunaPrice])

	const details = [
		{
			label: 'Collection',
			value: (
				<>
					{collection?.title}
					<ExclusiveMark isExclusive={Boolean(collection?.isExclusive)} />
				</>
			),
		},
		{
			label: 'Name item',
			value: tokenDetails?.name,
		},
		{
			label: 'Offer from',
			value: shortCreatorAddress,
		},
		{
			label: 'Offered price',
			value:
				currency === 'LUNA'
					? formatLUNADecimal(amount || 0)
					: formatUSTDecimal(amount || 0),
		},
		{
			label: 'Luart Fee',
			value: userTradingDetails?.sellFees?.luartFee,
		},
		{
			label: 'Royalty Fee',
			value: userTradingDetails?.sellFees?.royaltyFee,
		},
		{
			label: 'Amount after Fees',
			value:
				currency === 'LUNA'
					? formatLUNADecimal(prepareAmountAfterFees() || 0)
					: formatUSTDecimal(prepareAmountAfterFees() || 0),
		},
	]

	return (
		<Modal
			closeAfterTransition
			width={707}
			heading={
				!soldSuccessfully
					? 'Are you sure you want to accept offer?'
					: 'Congratulations!'
			}
			description={!soldSuccessfully ? '' : 'You successfully sold the item'}
			open={openModal}
			setOpen={setOpenModal}
			variant='secondary'
			allowClose={!loading.broadcasting && !loading.send}
		>
			<>
				{details.map(
					(detail, index) =>
						detail.value && (
							<SeparatedTexts
								key={`accept-offer-detail-${index}`}
								left={detail.label}
								right={detail.value}
							/>
						)
				)}
				{((txReceipt && soldSuccessfully) || errorMessage) && (
					<TxResult
						errorMessage={errorMessage}
						onSuccessClose={() => setTxReceipt(null)}
						onErrorClose={() => setErrorMessage('')}
						txReceipt={txReceipt}
						sx={{ mt: 3 }}
					/>
				)}
				{belowFloor && (
					<Alert
						severity='warning'
						sx={{ my: 3 }}
						title='You are about to accept an offer below the floor price.'
					/>
				)}
				{!soldSuccessfully ? (
					<Stack direction='row' alignItems='center' spacing={2} mt={3}>
						<Button
							variant='contained'
							color='tertiary'
							fullWidth
							type='button'
							onClick={() => setOpenModal(false)}
							disabled={loading.send || loading.broadcasting}
						>
							Cancel
						</Button>
						<Button
							variant='contained'
							color='primary'
							fullWidth
							type='button'
							onClick={executeBid}
							loading={loading.broadcasting || loading.send}
							loadingIndicator={<LoadingSpinner />}
						>
							{loadingText || 'Accept offer'}
						</Button>
					</Stack>
				) : (
					<>
						<Button
							variant='contained'
							color='primary'
							fullWidth
							type='button'
							onClick={() => setOpenModal(false)}
							sx={{ mt: 3 }}
						>
							Done
						</Button>
					</>
				)}
			</>
		</Modal>
	)
}

export default AcceptOfferModal
