import {
  NotificationsAction,
  NotificationsActionTypes,
  NotificationsState,
} from '../types/notifications.types';

const initialState: NotificationsState = {
  notifications: null,
  latestReadTimestamp: 0,
  notificationsLoaders: {
    getNotifications: true,
  },
  notificationsErrors: null,
  notificationsOpenOnMobile: false,
  userHasUnreadNotifications: false,
};

const notificationsReducer = (
  state = initialState,
  action: NotificationsAction
) => {
  switch (action.type) {
    case NotificationsActionTypes.MARK_NOTIFICATIONS_AS_READ:
      return {
        ...state,
        userHasUnreadNotifications: false,
        latestReadTimestamp: action.payload,
      };
    case NotificationsActionTypes.TOGGLE_NOTIFICATIONS_ON_MOBILE:
      return {
        ...state,
        notificationsOpenOnMobile: action.payload,
      };
    case NotificationsActionTypes.GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications,
        userHasUnreadNotifications: action.payload.userHasUnreadNotifications,
        latestReadTimestamp: action.payload.latestReadTimestamp,
        notificationsLoaders: {
          ...state.notificationsLoaders,
          getNotifications: false,
        },
      };
    case NotificationsActionTypes.NOTIFICATIONS_LOADING:
      return {
        ...state,
        notificationsLoaders: {
          ...state.notificationsLoaders,
          [action.payload]: false,
        },
      };
    case NotificationsActionTypes.NOTIFICATIONS_ERROR:
      return {
        ...state,
        notificationsErrors: {
          ...state.notificationsErrors,
          [action.payload]: true,
        },
      };
    default:
      return state;
  }
};

export default notificationsReducer;
