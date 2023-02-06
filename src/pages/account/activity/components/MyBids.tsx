import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import { getAllBidsForUser } from 'store/actions/account'
import { useWallet } from '@terra-money/wallet-provider'
import AccountLoader from '../../components/AccountLoader/AccountLoader'
import NotFound from 'components/NotFound/NotFound'
import Table from './Table'
import BidRow from './BidRow'
import CancelBidModal from 'components/CancelBidModal/CancelBidModal'
import { Bid } from 'utils/blockchain/blockchain.interface'

const MyBids = () => {
	const { accountLoaders, bids } = useSelector((state: State) => state.account)

	const dispatch = useDispatch()

	const wallet = useWallet()

	const userAddress = wallet.wallets[0].terraAddress

	const [selectedBid, setSelectedBid] = useState<null | Bid>(null)
	const [canceled, setCanceled] = useState(false)
	const [openCancelBidModal, setOpenCancelBidModal] = useState(false)

	useEffect(() => {
		if (!bids) dispatch(getAllBidsForUser(userAddress) as any)
	}, [dispatch, userAddress])

	if (accountLoaders?.getAllBidsForUser) {
		return <AccountLoader />
	}

	if (!bids || (bids && bids.length <= 0)) {
		return <NotFound heading='No bids' />
	}

	const handleCancelClick = (bid: Bid) => {
		setSelectedBid(bid)
		setCanceled(false)
		setOpenCancelBidModal(true)
	}

	return (
		<>
			{bids && bids.length > 0 && (
				<Table heading='My Bids'>
					{bids.map(bid => (
						<BidRow
							bid={bid}
							onCancelClick={handleCancelClick}
							key={`bid-${bid.bidOrderId}`}
						/>
					))}
				</Table>
			)}
			<CancelBidModal
				openModal={openCancelBidModal}
				setOpenModal={setOpenCancelBidModal}
				bid={selectedBid}
				canceled={canceled}
				setCanceled={setCanceled}
			/>
		</>
	)
}

export default MyBids
