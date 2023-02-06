import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import { useEffect } from 'react'
import { getOnSaleTokens } from 'store/actions/account'
import Tokens from './components/Tokens/Tokens'

const AccountOnSalePage = () => {
	const { onSaleTokens, accountLoaders } = useSelector(
		(state: State) => state.account
	)

	const dispatch = useDispatch()

	useEffect(() => {
		if (!onSaleTokens) {
			dispatch(getOnSaleTokens() as any)
		}
	}, [dispatch])

	return (
		<Tokens
			tokens={onSaleTokens}
			loading={accountLoaders?.getOnSaleTokens}
			tokensPerRow={3}
		/>
	)
}

export default AccountOnSalePage
