import deployments from './deployments.json'
import { getNetworkId, NetworkId } from './networks'

// Contract addresses. `npm run deploy:contracts` writes deployments.json;
// VITE_MARKETPLACE_ADDRESS overrides it (handy for previews).

interface Deployment {
	marketplace: string
	/** Collections deployed by the deploy script (also registered on the marketplace). */
	collections: string[]
}

export function getDeployment(networkId: NetworkId = getNetworkId()): Deployment {
	return (deployments as Record<NetworkId, Deployment>)[networkId]
}

export function getMarketplaceAddress(networkId: NetworkId = getNetworkId()): string {
	const override =
		networkId === 'pisco-1'
			? import.meta.env.VITE_PISCO_MARKETPLACE_ADDRESS
			: import.meta.env.VITE_MARKETPLACE_ADDRESS
	return override || getDeployment(networkId).marketplace
}

export function isMarketplaceDeployed(networkId: NetworkId = getNetworkId()): boolean {
	return Boolean(getMarketplaceAddress(networkId))
}
