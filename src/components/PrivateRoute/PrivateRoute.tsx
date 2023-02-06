import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import Loader from 'components/Loader/Loader';

const PrivateRoute = ({ ...rest }: RouteProps) => {
  const wallet = useWallet();
  const status = wallet.status;

  if (status === WalletStatus.INITIALIZING) return <Loader />;

  if (status !== WalletStatus.WALLET_CONNECTED) {
    return <Redirect to={ROUTES.HOME} />;
  }

  return <Route {...rest} />;
};

export default PrivateRoute;
