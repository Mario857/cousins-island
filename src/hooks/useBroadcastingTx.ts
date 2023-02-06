import blockchain from "utils/blockchain/blockchain";
import { TxReceipt } from "utils/blockchain/blockchain.interface";
import { scrollToBottom } from "utils/scrollToBottom";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const useBroadcastingTx = (
  txId?: TxReceipt["txId"],
  onSuccessBroadcast?: () => void,
  onFailedBroadcast?: () => void,
  scrollAfterTx = false
) => {
  const initialLoading = {
    send: false,
    broadcasting: false,
  };

  const [loading, setLoading] = useState(initialLoading);
  const [broadcasted, setBroadcasted] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 1010px)" });

  const desktopLoadingText = loading.send ? "Check your wallet..." : "Broadcasting transaction...";
  const mobileLoadingText = "";

  const loadingText =
    loading.send || loading.broadcasting ? (isMobile ? mobileLoadingText : desktopLoadingText) : false;

  useEffect(() => {
    if (txId) {
      setLoading({
        send: false,
        broadcasting: true,
      });
    }
  }, [txId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (txId && loading.broadcasting) {
      interval = setInterval(async () => {
        try {
          const txResult = await blockchain.getTxResult(txId);

          const txBroadcasted = txResult?.data;

          if (txBroadcasted) {
            const txSucceeded = txResult?.data?.logs && txResult?.data?.logs.length > 0;
            if (txSucceeded) {
              // tx succeeded
              setLoading(initialLoading);
              onSuccessBroadcast && onSuccessBroadcast();
              setBroadcasted(true);
              scrollAfterTx && scrollToBottom();
            } else {
              // tx failed
              setBroadcasted(true);
              setLoading(initialLoading);
              return onFailedBroadcast && onFailedBroadcast();
            }
          }
        } catch (error) {
          console.log(error);
          setBroadcasted(true);
          setLoading(initialLoading);
          scrollAfterTx && scrollToBottom();
        }
      }, 2000);
    }

    return () => {
      clearInterval(interval as ReturnType<typeof setInterval>);
    };
  }, [txId, loading]);

  return {
    loading,
    setLoading,
    loadingText,
    broadcasted,
    setBroadcasted,
  };
};

export default useBroadcastingTx;
