import _ from 'lodash';
import luartApi from './luart-api';
import terraUtils from './terra-utils';
import { LatestTransactionDetails } from '../blockchain.interface';

const LATEST_VIEWED_NOTIFICATION_TIMESTAMP_KEY =
  'luart_latest_viewed_notification_timestamp';


async function getNewNotifications(): Promise<{
  notifications: LatestTransactionDetails[];
  latestTimestamp: number;
}> {
  const latestTimestamp = getLatestViewedNotificationTimestamp();
  const userAddress = await terraUtils.getWalletAddress();

  const notifications = await luartApi.getLatestMarketplaceTransactions({
    limit: 100,
    type: ['marketplace_execute_order', 'marketplace_post_buy_order'], // Bids and sales
    offset: 0,
    additionalMongoQuery: {
      sellerAddress: userAddress,
    },
  });

  return {
    notifications,
    latestTimestamp,
  };
}

function markNotificationsAsViewed(
  notifications: LatestTransactionDetails[]
): number {
  const currentLatestTimestamp = getLatestViewedNotificationTimestamp();
  const newLatestTimestamp = _.max(notifications.map((n) => n.timestamp)) || 0;

  if (newLatestTimestamp > currentLatestTimestamp) {
    console.log(
      `Updating luart_latest_viewed_notification_timestamp in local storage with val: ${newLatestTimestamp}`
    );
    localStorage[LATEST_VIEWED_NOTIFICATION_TIMESTAMP_KEY] = newLatestTimestamp;
  }

  return newLatestTimestamp;
}

function hasUnreadNotifications(
  notifications: LatestTransactionDetails[]
): boolean {
  const currentLatestTimestamp = getLatestViewedNotificationTimestamp();
  const newLatestTimestamp = _.max(notifications.map((n) => n.timestamp)) || 0;

  return newLatestTimestamp > currentLatestTimestamp;
}

function getLatestViewedNotificationTimestamp(): number {
  const valFromLocalStorage = Number(
    localStorage[LATEST_VIEWED_NOTIFICATION_TIMESTAMP_KEY]
  );
  if (isNaN(valFromLocalStorage) || !valFromLocalStorage) {
    return 0;
  } else {
    return valFromLocalStorage;
  }
}

export default {
  getNewNotifications,
  markNotificationsAsViewed,
  hasUnreadNotifications,
};
