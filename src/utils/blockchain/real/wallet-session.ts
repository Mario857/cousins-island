import type { WalletSession } from 'wallet'

// The connected wallet, set by App.tsx on every render (null when disconnected).

let session: WalletSession | null = null
const waiters = new Set<() => void>()

export function setWallet(next: WalletSession | null): void {
	if (next === session) return
	session = next
	if (next) {
		waiters.forEach(w => w())
		waiters.clear()
	}
}

export function getSession(): WalletSession | null {
	return session
}

/**
 * The connected address. On first page load the wallet reconnects
 * asynchronously, so wait briefly for it.
 */
export async function getWalletAddress(options: { waitMs?: number; required?: boolean } = {}): Promise<string> {
	const { waitMs = 2000, required = true } = options
	if (!session && waitMs > 0) {
		await new Promise<void>(resolve => {
			const done = () => {
				clearTimeout(timer)
				waiters.delete(done)
				resolve()
			}
			const timer = setTimeout(done, waitMs)
			waiters.add(done)
		})
	}
	if (session) return session.address
	if (required) throw new Error('Connect your wallet first')
	return ''
}

export function requireSession(action: string): WalletSession {
	if (!session) throw new Error(`Connect your wallet to ${action}`)
	return session
}
