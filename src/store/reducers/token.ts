import {
  TokenState,
  TokenAction,
  TokenActionTypes,
} from 'store/types/token.types';

const initialState: TokenState = {
  tokenDetails: null,
  userTradingDetails: null,
  collection: null,
  tokenErrors: null,
  tokenLoaders: {
    getTokenDetails: true,
    getCollection: true,
    getUserTradingDetails: true,
    getAllBidsForToken: true,
  },
  bids: null,
  highestBidAmount: {
    luna: null,
    ust: null,
  },
};

const tokenReducer = (state = initialState, action: TokenAction) => {
  switch (action.type) {
    case TokenActionTypes.GET_BIDS:
      return {
        ...state,
        bids: action.payload.bids,
        highestBidAmount: action.payload.highestBidAmount,
        tokenLoaders: {
          ...state.tokenLoaders,
          getAllBidsForToken: false,
          removeBidFromTokenBids: false,
        },
      };
    case TokenActionTypes.GET_USER_TRADING_DETAILS:
      return {
        ...state,
        userTradingDetails: action.payload,
        tokenLoaders: {
          ...state.tokenLoaders,
          getUserTradingDetails: false,
        },
      };
    case TokenActionTypes.GET_COLLECTION:
      return {
        ...state,
        collection: action.payload,
        tokenLoaders: {
          ...state.tokenLoaders,
          getCollection: false,
        },
      };
    case TokenActionTypes.GET_TOKEN_DETAILS:
      return {
        ...state,
        tokenDetails: action.payload,
        tokenLoaders: {
          ...state.tokenLoaders,
          getTokenDetails: false,
        },
      };
    case TokenActionTypes.TOKEN_ERROR:
      return {
        ...state,
        tokenLoaders: {
          ...state.tokenLoaders,
          [action.payload]: false,
        },
      };
    case TokenActionTypes.TOKEN_LOADING:
      return {
        ...state,
        tokenLoaders: {
          ...state.tokenLoaders,
          [action.payload]: true,
        },
      };
    default:
      return state;
  }
};

export default tokenReducer;
