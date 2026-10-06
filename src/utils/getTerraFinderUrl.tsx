import { getNetwork } from 'config/networks'

/** Explorer link for an address (default) or a transaction hash (`type = 'tx'`). */
const getTerraFinderUrl = (data: string, type: 'address' | 'tx' = 'address') => {
	const network = getNetwork()
	return type === 'tx' ? network.explorerTx(data) : network.explorerAddress(data)
}

export default getTerraFinderUrl
