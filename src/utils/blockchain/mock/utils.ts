import type { TxReceipt } from '../blockchain.interface'

const DEFAULT_DELAY = 1000

export async function sleep(ms: number = DEFAULT_DELAY): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, ms))
}

export function getDefaultMockTxReceipt(): TxReceipt {
	const txId = '793FF55A0D08EF9C9C7E56B07ADC1C094C93DD5F8663F2FF1CF049B01B5B9632'
	return {
		txId,
		txTerraFinderUrl: `https://terrasco.pe/testnet/tx/${txId}`,
		txFee: '0.0123 LUNA',
	}
}

export default {
	sleep,
	getDefaultMockTxReceipt,
}
