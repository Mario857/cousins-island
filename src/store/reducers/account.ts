import {
  AccountState,
  AccountAction,
  AccountActionTypes,
} from '../types/account.types';

const initialState: AccountState = {
  ownedTokens: null,
  ownedTokensCount: null,
  onSaleTokens: null,
  balance: {
    ust: 0,
    luna: 0,
    luart: 0,
  },
  depositedBalance: null,
  bids: null,
  accountLoaders: {
    getOwnedTokens: true,
    getOnSaleTokens: true,
    getOwnedTokensCount: true,
    getAllBidsForUser: true,
  },
  accountErrors: null,
};

const accountReducer = (state = initialState, action: AccountAction) => {
  switch (action.type) {
    case AccountActionTypes.GET_DEPOSITED_BALANCE:
      return {
        ...state,
        depositedBalance: action.payload,
        accountLoaders: {
          ...state.accountLoaders,
          getDopositedBalance: false,
        },
      };
    case AccountActionTypes.REMOVE_BID:
      return {
        ...state,
        bids: state.bids
          ? state.bids.filter((bid) => bid.bidOrderId !== action.payload)
          : null,
      };
    case AccountActionTypes.GET_BIDS:
      return {
        ...state,
        bids: action.payload,
        accountLoaders: {
          ...state.accountLoaders,
          getAllBidsForUser: false,
        },
      };
    case AccountActionTypes.GET_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case AccountActionTypes.GET_OWNED_TOKENS_COUNT:
      return {
        ...state,
        ownedTokensCount: action.payload,
        accountLoaders: {
          ...state.accountLoaders,
          getOwnedTokensCount: false,
        },
      };
    case AccountActionTypes.GET_OWNED_TOKENS:
      return {
        ...state,
        ownedTokens: state.ownedTokens
          ? { ...state.ownedTokens, ...action.payload }
          : action.payload,
        accountLoaders: {
          ...state.accountLoaders,
          getOwnedTokens: false,
        },
      };
    case AccountActionTypes.GET_ON_SALE_TOKENS:
      return {
        ...state,
        onSaleTokens: action.payload,
        accountLoaders: {
          ...state.accountLoaders,
          getOnSaleTokens: false,
        },
      };
    case AccountActionTypes.ACCOUNT_LOADING:
      return {
        ...state,
        accountLoaders: {
          ...state.accountLoaders,
          [action.payload]: true,
        },
      };
    case AccountActionTypes.ACCOUNT_ERROR:
      return {
        ...state,
        accountLoaders: {
          ...state.accountLoaders,
          [action.payload]: false,
        },
      };
    default:
      return state;
  }
};

export default accountReducer;
