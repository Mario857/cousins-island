// Browser wallets that expose Keplr's injected API. Station (Terraform Labs)
// shut down in 2024 and Leap in 2026, so Keplr is the main Terra wallet now;
// Cosmostation exposes the same interface under window.cosmostation.

import type { OfflineAminoSigner } from '@cosmjs/amino'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'

export interface KeplrKey {
	name: string
	bech32Address: string
}

/** The subset of Keplr's injected API this app uses. */
export interface KeplrLike {
	enable(chainId: string | string[]): Promise<void>
	getKey(chainId: string): Promise<KeplrKey>
	getOfflineSignerAuto(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner>
	experimentalSuggestChain?(chainInfo: unknown): Promise<void>
	disable?(chainId?: string): Promise<void>
}

export interface WalletProviderInfo {
	id: 'keplr' | 'cosmostation'
	name: string
	installUrl: string
	/** Window event fired when the user switches accounts in the wallet. */
	accountChangeEvent: string
	get(): KeplrLike | undefined
}

declare global {
	interface Window {
		keplr?: KeplrLike
		cosmostation?: { providers?: { keplr?: KeplrLike } }
	}
}

export const WALLET_PROVIDERS: WalletProviderInfo[] = [
	{
		id: 'keplr',
		name: 'Keplr',
		installUrl: 'https://www.keplr.app/get',
		accountChangeEvent: 'keplr_keystorechange',
		get: () => window.keplr,
	},
	{
		id: 'cosmostation',
		name: 'Cosmostation',
		installUrl: 'https://cosmostation.io/products/cosmostation_extension',
		accountChangeEvent: 'cosmostation_keystorechange',
		get: () => window.cosmostation?.providers?.keplr,
	},
]

export function findProvider(id: string): WalletProviderInfo | undefined {
	return WALLET_PROVIDERS.find(p => p.id === id)
}

/**
 * Extensions inject their object after the page loads, so wait briefly.
 * Resolves as soon as any wallet shows up, or after `timeoutMs`.
 */
export async function waitForWallets(timeoutMs = 1500): Promise<void> {
	const anyInjected = () => WALLET_PROVIDERS.some(p => p.get())
	const started = Date.now()
	while (!anyInjected() && Date.now() - started < timeoutMs) {
		await new Promise(r => setTimeout(r, 100))
	}
}
