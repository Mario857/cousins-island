import { combineReducers } from 'redux';
import collectionsReducer from './collections';
import accountReducer from './account';
import tokenReducer from './token';
import notificationsReducer from './notifications';
import statisticsReducer from './statistics';

export const rootReducer = combineReducers({
  collections: collectionsReducer,
  account: accountReducer,
  token: tokenReducer,
  notifications: notificationsReducer,
  statistics: statisticsReducer,
});
