import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getNetwork, keplrChainInfo, NetworkConfig } from 'config/networks'
import { findProvider, KeplrLike, WALLET_PROVIDERS, waitForWallets } from './providers'

// Same names as the old @terra-money/wallet-provider, so components barely change.
export enum WalletStatus {
	INITIALIZING = 'INITIALIZING',
	WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
	WALLET_CONNECTED = 'WALLET_CONNECTED',
}

export enum ConnectType {
	EXTENSION = 'EXTENSION',
}

export interface WalletConnection {
	type: ConnectType
	identifier: string
	name: string
}

export interface WalletInstallation extends WalletConnection {
	url: string
}

export interface ConnectedWallet {
	terraAddress: string
	name: string
}

/** What the blockchain layer needs from a connected wallet. */
export interface WalletSession {
	address: string
	network: NetworkConfig
	getSigningClient(): Promise<SigningCosmWasmClient>
}

export interface WalletState {
	status: WalletStatus
	network: NetworkConfig
	wallets: ConnectedWallet[]
	/** Wallets installed in this browser. */
	availableConnections: WalletConnection[]
	/** Wallets not installed, with a link to get them. */
	availableInstallations: WalletInstallation[]
	connectError: string | null
	session: WalletSession | null
	connect(type?: ConnectType, identifier?: string): Promise<void>
	disconnect(): void
	/** Re-read the account from the wallet. */
	refetchStates(): void
}

const LAST_WALLET_KEY = 'cousins_last_wallet'

const WalletContext = createContext<WalletState | null>(null)

function readLastWallet(): string | null {
	try {
		return localStorage.getItem(LAST_WALLET_KEY)
	} catch {
		return null
	}
}

function writeLastWallet(id: string | null) {
	try {
		if (id) localStorage.setItem(LAST_WALLET_KEY, id)
		else localStorage.removeItem(LAST_WALLET_KEY)
	} catch {
		// ignore
	}
}

async function enableChain(provider: KeplrLike, network: NetworkConfig) {
	try {
		await provider.enable(network.chainId)
	} catch (e) {
		// Keplr doesn't know the testnet out of the box; suggest it, then retry.
		if (!provider.experimentalSuggestChain) throw e
		await provider.experimentalSuggestChain(keplrChainInfo(network))
		await provider.enable(network.chainId)
	}
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const network = useMemo(() => getNetwork(), [])
	const [status, setStatus] = useState(WalletStatus.INITIALIZING)
	const [account, setAccount] = useState<{ walletId: string; address: string; name: string } | null>(null)
	const [installed, setInstalled] = useState<string[]>([])
	const [connectError, setConnectError] = useState<string | null>(null)
	const clientRef = useRef<{ key: string; client: Promise<SigningCosmWasmClient> } | null>(null)

	const loadAccount = useCallback(
		async (walletId: string, interactive: boolean) => {
			const info = findProvider(walletId)
			const provider = info?.get()
			if (!info || !provider) throw new Error(`${info?.name ?? walletId} is not installed`)
			if (interactive) await enableChain(provider, network)
			else await provider.enable(network.chainId)
			const key = await provider.getKey(network.chainId)
			setAccount({ walletId, address: key.bech32Address, name: key.name })
			setStatus(WalletStatus.WALLET_CONNECTED)
			writeLastWallet(walletId)
		},
		[network]
	)

	// Detect wallets and silently reconnect to the last one used.
	useEffect(() => {
		let cancelled = false
		;(async () => {
			await waitForWallets()
			if (cancelled) return
			setInstalled(WALLET_PROVIDERS.filter(p => p.get()).map(p => p.id))
			const last = readLastWallet()
			if (last && findProvider(last)?.get()) {
				try {
					await loadAccount(last, false)
					return
				} catch {
					writeLastWallet(null)
				}
			}
			if (!cancelled) setStatus(WalletStatus.WALLET_NOT_CONNECTED)
		})()
		return () => {
			cancelled = true
		}
	}, [loadAccount])

	// Follow account switches inside the wallet.
	useEffect(() => {
		if (!account) return
		const info = findProvider(account.walletId)
		if (!info) return
		const onChange = () => {
			clientRef.current = null
			loadAccount(account.walletId, false).catch(() => {
				setAccount(null)
				setStatus(WalletStatus.WALLET_NOT_CONNECTED)
			})
		}
		window.addEventListener(info.accountChangeEvent, onChange)
		return () => window.removeEventListener(info.accountChangeEvent, onChange)
	}, [account, loadAccount])

	const connect = useCallback(
		async (_type?: ConnectType, identifier?: string) => {
			const walletId = identifier ?? installed[0] ?? 'keplr'
			setConnectError(null)
			try {
				await loadAccount(walletId, true)
			} catch (e) {
				const message = e instanceof Error ? e.message : String(e)
				setConnectError(message)
				setStatus(WalletStatus.WALLET_NOT_CONNECTED)
				throw e
			}
		},
		[installed, loadAccount]
	)

	const disconnect = useCallback(() => {
		const info = account && findProvider(account.walletId)
		info?.get()?.disable?.(network.chainId).catch(() => undefined)
		clientRef.current = null
		writeLastWallet(null)
		setAccount(null)
		setStatus(WalletStatus.WALLET_NOT_CONNECTED)
	}, [account, network])

	const refetchStates = useCallback(() => {
		if (account) loadAccount(account.walletId, false).catch(() => undefined)
	}, [account, loadAccount])

	const session = useMemo<WalletSession | null>(() => {
		if (!account) return null
		return {
			address: account.address,
			network,
			getSigningClient: () => {
				const key = `${account.walletId}:${account.address}`
				if (clientRef.current?.key !== key) {
					const provider = findProvider(account.walletId)?.get()
					if (!provider) return Promise.reject(new Error('Wallet is no longer available'))
					const client = provider
						.getOfflineSignerAuto(network.chainId)
						.then(signer =>
							SigningCosmWasmClient.connectWithSigner(network.rpc[0], signer, {
								gasPrice: GasPrice.fromString(network.gasPrice),
							})
						)
					client.catch(() => {
						if (clientRef.current?.key === key) clientRef.current = null
					})
					clientRef.current = { key, client }
				}
				return clientRef.current.client
			},
		}
	}, [account, network])

	const value = useMemo<WalletState>(
		() => ({
			status,
			network,
			wallets: account ? [{ terraAddress: account.address, name: account.name }] : [],
			availableConnections: WALLET_PROVIDERS.filter(p => installed.includes(p.id)).map(p => ({
				type: ConnectType.EXTENSION,
				identifier: p.id,
				name: p.name,
			})),
			availableInstallations: WALLET_PROVIDERS.filter(p => !installed.includes(p.id)).map(p => ({
				type: ConnectType.EXTENSION,
				identifier: p.id,
				name: p.name,
				url: p.installUrl,
			})),
			connectError,
			session,
			connect,
			disconnect,
			refetchStates,
		}),
		[status, network, account, installed, connectError, session, connect, disconnect, refetchStates]
	)

	return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletState {
	const ctx = useContext(WalletContext)
	if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
	return ctx
}
