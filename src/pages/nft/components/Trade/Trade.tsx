import Sell from './Sell/Sell';
import Header from './Header';
import CardBody from 'components/Card/CardBody';
import Card from 'components/Card/Card';
import Price from './Price';
import BuyNow from './BuyNow/BuyNow';
import CancelSelling from './CancelSelling/CancelSelling';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import WalletSelector from 'components/WalletSelector/WalletSelector';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import Box from '@mui/material/Box';
import isUserOnStageMarketplace from 'utils/isUserOnStageMarketplace';
import Transfer from './Transfer/Transfer';
import PlaceBid from './PlaceBid/PlaceBid';
import About from './About/About';

export enum UserTradeStatus {
  'NOT_CONNECTED' = 'NOT_CONNECTED',
  'CAN_CANCEL_SELLING' = 'CAN_CANCEL_SELLING',
  'CAN_BUY' = 'CAN_BUY',
  'CAN_SELL' = 'CAN_SELL',
  'NO_OFFERS' = 'NO_OFFERS',
}

interface TradeProps {
  previousQuery: string;
}

const Trade: React.FC<TradeProps> = ({ previousQuery }) => {
  const { userTradingDetails, collection } = useSelector(
    (state: State) => state.token
  );

  const wallet = useWallet();

  const sellPriceAmount = userTradingDetails?.sellPriceAmount;
  const sellPriceCurrency = userTradingDetails?.sellPriceCurrency;

  const getUserTradeStatus = () => {
    if (
      wallet.status === WalletStatus.INITIALIZING ||
      wallet.status === WalletStatus.WALLET_NOT_CONNECTED
    ) {
      return UserTradeStatus.NOT_CONNECTED;
    } else if (
      !userTradingDetails?.canUserSell &&
      userTradingDetails?.doesUserOwnIt
    ) {
      return UserTradeStatus.CAN_CANCEL_SELLING;
    } else if (userTradingDetails?.canUserSell) {
      return UserTradeStatus.CAN_SELL;
    } else if (
      userTradingDetails?.sellPriceCurrency &&
      userTradingDetails?.sellPriceAmount &&
      userTradingDetails?.canUserBuy
    ) {
      return UserTradeStatus.CAN_BUY;
    } else {
      return UserTradeStatus.NO_OFFERS;
    }
  };

  const userTradeStatus = getUserTradeStatus();

  const isLive = Boolean(
    (collection &&
      collection.marketplaceListingStart &&
      collection.marketplaceListingStart <= Date.now()) ||
      isUserOnStageMarketplace
  );

  return (
    <Card variant="secondary">
      <Header previousQuery={previousQuery} />
      <CardBody>
        {isLive && (
          <>
            {(userTradeStatus === UserTradeStatus.NOT_CONNECTED ||
              userTradeStatus === UserTradeStatus.CAN_BUY ||
              (UserTradeStatus.NO_OFFERS &&
                !userTradingDetails?.doesUserOwnIt) ||
              userTradeStatus === UserTradeStatus.CAN_CANCEL_SELLING) && (
              <Price
                sellPriceAmount={sellPriceAmount}
                sellPriceCurrency={sellPriceCurrency}
                label="Price"
              />
            )}
            {userTradeStatus === UserTradeStatus.NOT_CONNECTED ? (
              <Box
                px={3}
                pt={3}
                pb={6}
                borderTop="1px solid rgba(255, 255, 255, 0.18)"
              >
                {wallet.status === WalletStatus.WALLET_NOT_CONNECTED && (
                  <WalletSelector
                    isPrimary={true}
                    btnNotConnectedId="trade-wallet-btn"
                  />
                )}
              </Box>
            ) : (
              <>
                {userTradeStatus !== UserTradeStatus.NO_OFFERS && (
                  <Box
                    px={3}
                    pt={3}
                    pb={6}
                    borderTop={
                      userTradeStatus === UserTradeStatus.CAN_SELL
                        ? undefined
                        : '1px solid rgba(255, 255, 255, 0.18)'
                    }
                  >
                    <CancelSelling userTradeStatus={userTradeStatus} />
                    <Sell userTradeStatus={userTradeStatus} />
                    <Transfer userTradeStatus={userTradeStatus} />
                    <BuyNow userTradeStatus={userTradeStatus} />
                    <PlaceBid
                      userTradeStatus={userTradeStatus}
                      sellPrice={Number(sellPriceAmount)}
                      sellCurrency={String(sellPriceCurrency)}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </CardBody>
      <About />
    </Card>
  );
};

export default Trade;
