import React from 'react';
import { useWallet, WalletStatus } from 'wallet';
import { Navigate } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import Loader from 'components/Loader/Loader';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const wallet = useWallet();
  const status = wallet.status;

  if (status === WalletStatus.INITIALIZING) return <Loader />;

  if (status !== WalletStatus.WALLET_CONNECTED) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
