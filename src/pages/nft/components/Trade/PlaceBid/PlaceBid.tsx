import { useEffect, useState } from 'react'
import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import { UserTradeStatus } from '../Trade'
import OfferForm from './OfferForm'
import { TerraCurrency, TxReceipt } from 'utils/blockchain/blockchain.interface'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import blockchainModule from 'utils/blockchain/blockchain'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import SuccessfullTokenModalAction from 'components/SuccessfullTokenModalAction/SuccessfullTokenModalAction'
import { formatLUNADecimal } from 'utils/currency'
import { getAllBidsForToken } from 'store/actions/token'
import { useWallet } from 'wallet'
import { getAllBidsForUser, getBalance } from 'store/actions/account'
import TokenDetails from './TokenDetails'

interface PlaceBidProps {
	userTradeStatus: UserTradeStatus
	/** Bids can also be placed on NFTs that aren't listed. */
	canUserBid?: boolean
	sellPrice: number
	sellCurrency: string
}

export enum View {
	POST_BID,
	BID_POSTED,
}

const PlaceBid: React.FC<PlaceBidProps> = ({
	userTradeStatus,
	canUserBid,
	sellPrice,
	sellCurrency,
}) => {
	const [openModal, setOpenModal] = useState(false)
	const [view, setView] = useState<View>(View.POST_BID)

	const [txReceipt, setTxReceipt] = useState<TxReceipt | null>(null)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const { tokenDetails } = useSelector((state: State) => state.token)
	// Bids are paid from the wallet when placed (the contract holds them in escrow).
	const { balance } = useSelector((state: State) => state.account)
	const walletBalance = { LUNA: balance?.luna ?? 0, UST: 0 }

	const { tokenId, name: tokenName, nftContractAddress } = tokenDetails!

	const dispatch = useDispatch()

	const wallet = useWallet()

	const userAddress = wallet?.wallets?.[0]?.terraAddress

	const handleSuccessBroadcast = () => {
		if (view === View.POST_BID) {
			dispatch(getAllBidsForToken(nftContractAddress!, tokenId!) as any)
			dispatch(getAllBidsForUser(userAddress) as any)
			dispatch(getBalance() as any)
			setView(View.BID_POSTED)
		}
	}

	const { loading, setLoading, loadingText } = useBroadcastingTx(
		txReceipt?.txId,
		handleSuccessBroadcast
	)

	const postBid = async (amount: number, currency: TerraCurrency) => {
		setLoading(loading => ({ ...loading, send: true }))
		try {
			const bidRequest = {
				nftContractAddress: nftContractAddress!,
				tokenId: tokenId!,
				amount,
				currency,
			}

			const txReceipt = await blockchainModule.postBid(bidRequest)

			setTxReceipt(txReceipt)

			setSuccessMessage(
				`You have successfully placed your bid for ${
					formatLUNADecimal(amount)
				}`
			)
			setErrorMessage('')
		} catch (error) {
			console.log(error)
			setSuccessMessage('')
			setErrorMessage('There was an error while processing the transaction.')
		}

		setLoading(loading => ({ ...loading, send: false }))
	}

	useEffect(() => {
		dispatch(getBalance() as any)
	}, [dispatch])

	const getViewDetails = () => {
		switch (view) {
			case View.BID_POSTED:
				return {
					heading: 'Your bid is successfully!',
					description: '',
					children: (
						<SuccessfullTokenModalAction
							txReceipt={txReceipt}
							setTxReceipt={setTxReceipt}
							successMessage={successMessage}
							setSuccessMessage={setSuccessMessage}
							onCloseModal={() => setOpenModal(false)}
							tokenDetails={tokenDetails}
						/>
					),
				}
			case View.POST_BID:
			default:
				return {
					heading: 'Make offer',
					description: `You are about to place a bid for ${tokenName}. The amount is held by the marketplace until the owner accepts your bid or you cancel it.`,
					header: <TokenDetails />,
					children: (
						<OfferForm
							postBid={postBid}
							loading={loading}
							loadingText={loadingText}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							balance={walletBalance}
							setOpenModal={setOpenModal}
							setView={setView}
							sellPrice={sellPrice}
							sellCurrency={sellCurrency}
						/>
					),
				}
		}
	}

	const viewDetails = getViewDetails()

	return (
		<>
			{(userTradeStatus === UserTradeStatus.CAN_BUY ||
				(userTradeStatus === UserTradeStatus.NO_OFFERS && canUserBid)) && (
				<Button
					variant='contained'
					color='tertiary'
					type='button'
					onClick={() => {
						if (view !== View.POST_BID) setView(View.POST_BID)
						setOpenModal(true)
					}}
					fullWidth
					sx={{ mt: 2 }}
				>
					Make Offer
				</Button>
			)}
			<Modal
				closeAfterTransition
				width={707}
				heading={viewDetails.heading}
				description={viewDetails.description}
				open={openModal}
				setOpen={setOpenModal}
				allowClose={!loading.broadcasting && !loading.send}
				header={viewDetails.header}
			>
				{viewDetails.children}
			</Modal>
		</>
	)
}

export default PlaceBid
