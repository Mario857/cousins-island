import { TxReceipt } from "../blockchain.interface";

const DEFAULT_DELAY = 1000;

// Async version of sleep
export async function sleep (ms: number = DEFAULT_DELAY): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

export function getDefaultMockTxReceipt(): TxReceipt {
  return {
    txId: "793FF55A0D08EF9C9C7E56B07ADC1C094C93DD5F8663F2FF1CF049B01B5B9632",
    txTerraFinderUrl: "https://finder.terra.money/bombay-12/tx/793FF55A",
    txFee: "0.225000 UST"
  }
}

export default {
  sleep,
  getDefaultMockTxReceipt, 
};
