import { LatestTransactionDetails } from 'utils/blockchain/blockchain.interface';

export interface NotificationsState {
  notifications: LatestTransactionDetails[] | null;
  latestReadTimestamp: number;
  notificationsLoaders: {
    [key: string]: boolean;
  } | null;
  notificationsErrors: {
    [key: string]: boolean;
  } | null;
  notificationsOpenOnMobile: boolean;
  userHasUnreadNotifications: boolean;
}

export enum NotificationsActionTypes {
  NOTIFICATIONS_LOADING = 'NOTIFICATIONS_LOADING',
  NOTIFICATIONS_ERROR = 'NOTIFICATIONS_ERORR',
  GET_NOTIFICATIONS = 'GET_NOTIFICATIONS',
  TOGGLE_NOTIFICATIONS_ON_MOBILE = 'TOGGLE_NOTIFICATIONS_ON_MOBILE',
  MARK_NOTIFICATIONS_AS_READ = 'MARK_NOTIFICATIONS_AS_READ',
}

interface MarkNotificationsAsReadAction {
  type: NotificationsActionTypes.MARK_NOTIFICATIONS_AS_READ;
  payload: number;
}

interface ToggleNotifcationsOnMobileAction {
  type: NotificationsActionTypes.TOGGLE_NOTIFICATIONS_ON_MOBILE;
  payload: boolean;
}

interface NotificationsLoadingAction {
  type: NotificationsActionTypes.NOTIFICATIONS_LOADING;
  payload: string;
}

interface NotificationsErrorAction {
  type: NotificationsActionTypes.NOTIFICATIONS_ERROR;
  payload: string;
}

interface GetNotificationsAction {
  type: NotificationsActionTypes.GET_NOTIFICATIONS;
  payload: {
    notifications: LatestTransactionDetails[];
    userHasUnreadNotifications: boolean;
    latestReadTimestamp: number;
  };
}

export type NotificationsAction =
  | NotificationsLoadingAction
  | NotificationsErrorAction
  | GetNotificationsAction
  | ToggleNotifcationsOnMobileAction
  | MarkNotificationsAsReadAction;
