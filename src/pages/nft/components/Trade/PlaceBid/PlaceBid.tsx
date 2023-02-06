import { useEffect, useState } from 'react'
import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import { UserTradeStatus } from '../Trade'
import OfferForm from './OfferForm'
import {
	TerraCurrency,
	TxReceipt,
	Balance,
} from 'utils/blockchain/blockchain.interface'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import blockchainModule from 'utils/blockchain/blockchain'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import SuccessfullTokenModalAction from 'components/SuccessfullTokenModalAction/SuccessfullTokenModalAction'
import { formatLUNADecimal, formatUSTDecimal } from 'utils/currency'
import { getAllBidsForToken } from 'store/actions/token'
import { useWallet } from '@terra-money/wallet-provider'
import {
	getAllBidsForUser,
	getBalance,
	getDepositedBalance,
} from 'store/actions/account'
import TokenDetails from './TokenDetails'
import DepositFundsForm from './DepositFundsForm'

interface PlaceBidProps {
	userTradeStatus: UserTradeStatus
	sellPrice: number
	sellCurrency: string
}

export enum View {
	POST_BID,
	BID_POSTED,
	DEPOSIT_FUNDS,
}

const PlaceBid: React.FC<PlaceBidProps> = ({
	userTradeStatus,
	sellPrice,
	sellCurrency,
}) => {
	const [openModal, setOpenModal] = useState(false)
	const [view, setView] = useState<View>(View.POST_BID)

	const [txReceipt, setTxReceipt] = useState<TxReceipt | null>(null)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const { tokenDetails } = useSelector((state: State) => state.token)
	const { depositedBalance } = useSelector((state: State) => state.account)

	const { tokenId, name: tokenName, nftContractAddress } = tokenDetails!

	const dispatch = useDispatch()

	const wallet = useWallet()

	const userAddress = wallet?.wallets?.[0]?.terraAddress

	const handleSuccessBroadcast = () => {
		if (view === View.POST_BID) {
			dispatch(getAllBidsForToken(nftContractAddress!, tokenId!) as any)
			dispatch(getAllBidsForUser(userAddress) as any)
			setView(View.BID_POSTED)
		}

		if (view === View.DEPOSIT_FUNDS) {
			dispatch(getDepositedBalance() as any)
			dispatch(getBalance() as any)
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
					currency === 'LUNA' ? formatLUNADecimal(amount) : formatUSTDecimal(amount)
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

	const depositFunds = async (amount: number, currency: TerraCurrency) => {
		setLoading(loading => ({ ...loading, send: true }))
		try {
			const txReceipt = await blockchainModule.depositTokensOnMarketplace(
				amount,
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

	useEffect(() => {
		if (!depositedBalance) dispatch(getDepositedBalance() as any)
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
			case View.DEPOSIT_FUNDS:
				return {
					heading: 'Deposit funds',
					description: 'Deposit funds to make an offer.',
					children: (
						<DepositFundsForm
							loading={loading}
							loadingText={loadingText}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							setView={setView}
							depositFunds={depositFunds}
							txReceipt={txReceipt}
							setTxReceipt={setTxReceipt}
							successMessage={successMessage}
							setSuccessMessage={setSuccessMessage}
						/>
					),
				}
			case View.POST_BID:
			default:
				return {
					heading: 'Make offer',
					description: `You are about to place a bid for ${tokenName}. Make sure you have the selected currency deposited in the Marketplace.`,
					header: <TokenDetails />,
					children: (
						<OfferForm
							postBid={postBid}
							loading={loading}
							loadingText={loadingText}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							balance={depositedBalance}
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
			{userTradeStatus === UserTradeStatus.CAN_BUY && (
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
