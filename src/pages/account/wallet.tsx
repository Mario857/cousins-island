import Grid from '@mui/material/Grid'
import Wallet from './components/Wallet/Wallet'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import { getDepositedBalance } from 'store/actions/account'

const LuartWalletPage = () => {
	const { depositedBalance } = useSelector((state: State) => state.account)

	const dispatch = useDispatch()

	useEffect(() => {
		if (!depositedBalance) dispatch(getDepositedBalance() as any)
	}, [dispatch])

	return (
		<Grid container spacing={4}>
			<Grid item xs={12} md={4}>
				<Wallet
					balance={depositedBalance ? depositedBalance.LUNA : 0}
					currency='LUNA'
				/>
			</Grid>
			<Grid item xs={12} md={4}>
				<Wallet
					balance={depositedBalance ? depositedBalance.UST : 0}
					currency='UST'
				/>
			</Grid>
		</Grid>
	)
}

export default LuartWalletPage
