import { useWallet } from '@terra-money/wallet-provider';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useWalletRefetchStates = () => {
  const wallet = useWallet();
  const location = useLocation();

  const [prevWalletAddress, setPrevWalletAddress] = useState<null | string>(
    null
  );

  const compareWalletAddresses = () => {
    const currentWalletAddress = wallet?.wallets?.[0]?.terraAddress;

    if (!prevWalletAddress) return;

    if (currentWalletAddress === prevWalletAddress) return;

    window.location.reload(); // Reload page to get new wallet data
  };

  useEffect(() => {
    wallet.refetchStates();
  }, [location.pathname]);

  useEffect(() => {
    if (wallet && !prevWalletAddress) {
      const prevWalletAddress = wallet?.wallets?.[0]?.terraAddress;
      setPrevWalletAddress(prevWalletAddress);
    }

    if (prevWalletAddress) {
      compareWalletAddresses();
    }
  }, [wallet]);
};

const WalletRefetchStates = () => {
  useWalletRefetchStates();
  return null;
};

export default WalletRefetchStates;
