import {
  NotificationsAction,
  NotificationsActionTypes,
} from 'store/types/notifications.types';
import blockchainModule from 'utils/blockchain/blockchain';
import { LatestTransactionDetails } from 'utils/blockchain/blockchain.interface';
import { Dispatch } from 'redux';

export const markNotificationsAsRead =
  (notifications: LatestTransactionDetails[]) =>
  (dispatch: Dispatch<NotificationsAction>) => {
    const latestReadTimestamp =
      blockchainModule.markNotificationsAsViewed(notifications);

    dispatch({
      type: NotificationsActionTypes.MARK_NOTIFICATIONS_AS_READ,
      payload: latestReadTimestamp,
    });
  };

export const toggleNotificationsOnMobile = (open: boolean) => {
  return {
    type: NotificationsActionTypes.TOGGLE_NOTIFICATIONS_ON_MOBILE,
    payload: open,
  };
};

export const getNotifications =
  () => async (dispatch: Dispatch<NotificationsAction>) => {
    const loadingName = 'getNotifications';

    dispatch({
      type: NotificationsActionTypes.NOTIFICATIONS_LOADING,
      payload: loadingName,
    });

    try {
      const { notifications, latestTimestamp: latestReadTimestamp } =
        await blockchainModule.getNewNotifications();

      const userHasUnreadNotifications =
        blockchainModule.hasUnreadNotifications(notifications);

      dispatch({
        type: NotificationsActionTypes.GET_NOTIFICATIONS,
        payload: {
          notifications,
          userHasUnreadNotifications,
          latestReadTimestamp,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: NotificationsActionTypes.NOTIFICATIONS_ERROR,
        payload: loadingName,
      });
    }
  };
