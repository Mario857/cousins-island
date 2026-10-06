// Terra 2 network settings. Endpoints were checked live on 2026-10-06.
// Several RPC/REST URLs are listed so the app can fall back if one is down
// (Terraform Labs' own phoenix-lcd.terra.dev / lcd-terra.tfl.foundation are gone).

export type NetworkId = 'phoenix-1' | 'pisco-1'

export interface NetworkConfig {
	chainId: NetworkId
	name: string
	isTestnet: boolean
	rpc: string[]
	rest: string[]
	/** Minimum gas price, e.g. "0.015uluna". */
	gasPrice: string
	denom: 'uluna'
	decimals: 6
	explorerTx: (hash: string) => string
	explorerAddress: (address: string) => string
}

const bech32Config = {
	bech32PrefixAccAddr: 'terra',
	bech32PrefixAccPub: 'terrapub',
	bech32PrefixValAddr: 'terravaloper',
	bech32PrefixValPub: 'terravaloperpub',
	bech32PrefixConsAddr: 'terravalcons',
	bech32PrefixConsPub: 'terravalconspub',
}

const luna = { coinDenom: 'LUNA', coinMinimalDenom: 'uluna', coinDecimals: 6 }

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
	'phoenix-1': {
		chainId: 'phoenix-1',
		name: 'Terra',
		isTestnet: false,
		rpc: [
			import.meta.env.VITE_PHOENIX_RPC,
			'https://terra-rpc.publicnode.com:443',
			'https://rpc-phoenix.keplr.app',
			'https://terra-rpc.polkachu.com:443',
		].filter((u): u is string => Boolean(u)),
		rest: [
			import.meta.env.VITE_PHOENIX_REST,
			'https://terra-rest.publicnode.com',
			'https://lcd-phoenix.keplr.app',
			'https://terra-api.polkachu.com',
		].filter((u): u is string => Boolean(u)),
		gasPrice: '0.015uluna',
		denom: 'uluna',
		decimals: 6,
		explorerTx: hash => `https://terra.valopers.com/transactions/${hash}`,
		explorerAddress: address => `https://terra.valopers.com/account/${address}`,
	},
	'pisco-1': {
		chainId: 'pisco-1',
		name: 'Terra Testnet',
		isTestnet: true,
		rpc: [
			import.meta.env.VITE_PISCO_RPC,
			'https://terra-testnet-rpc.polkachu.com:443',
			'https://pisco-rpc.terra.dev',
		].filter((u): u is string => Boolean(u)),
		rest: [
			import.meta.env.VITE_PISCO_REST,
			'https://terra-testnet-api.polkachu.com',
			'https://pisco-lcd.terra.dev',
		].filter((u): u is string => Boolean(u)),
		gasPrice: '0.015uluna',
		denom: 'uluna',
		decimals: 6,
		explorerTx: hash => `https://terrasco.pe/testnet/tx/${hash}`,
		explorerAddress: address => `https://terrasco.pe/testnet/address/${address}`,
	},
}

/** Chain description for Keplr's `experimentalSuggestChain`. */
export function keplrChainInfo(network: NetworkConfig) {
	return {
		chainId: network.chainId,
		chainName: network.name,
		rpc: network.rpc[0],
		rest: network.rest[0],
		bip44: { coinType: 330 },
		bech32Config,
		currencies: [luna],
		feeCurrencies: [{ ...luna, gasPriceStep: { low: 0.015, average: 0.015, high: 0.04 } }],
		stakeCurrency: luna,
		features: ['cosmwasm'],
	}
}

const NETWORK_STORAGE_KEY = 'selectedNetworkId'

/**
 * Mainnet by default. `?use-testnet` / `?use-mainnet` in the URL switches and
 * remembers the choice; `?clear-network-selection` forgets it.
 */
export function getNetworkId(): NetworkId {
	const url = window.location.href
	try {
		if (url.includes('use-testnet')) localStorage.setItem(NETWORK_STORAGE_KEY, 'pisco-1')
		if (url.includes('use-mainnet')) localStorage.setItem(NETWORK_STORAGE_KEY, 'phoenix-1')
		if (url.includes('clear-network-selection')) localStorage.removeItem(NETWORK_STORAGE_KEY)
		const stored = localStorage.getItem(NETWORK_STORAGE_KEY)
		if (stored === 'pisco-1' || stored === 'phoenix-1') return stored
	} catch {
		// localStorage can be unavailable (private mode); fall through to the default.
	}
	const fromEnv = import.meta.env.VITE_DEFAULT_NETWORK
	return fromEnv === 'pisco-1' ? 'pisco-1' : 'phoenix-1'
}

export function getNetwork(): NetworkConfig {
	return NETWORKS[getNetworkId()]
}
