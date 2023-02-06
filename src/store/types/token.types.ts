import {
  Bid,
  NFTCollectionDetails,
  NFTTokenDetails,
  NFTTokenTradingDetails,
} from 'utils/blockchain/blockchain.interface';

interface HighestBidAmount {
  luna: null | number;
  ust: null | number;
}

interface Bids {
  highestToLowest: Bid[];
  lowestToHighest: Bid[];
}

export interface TokenState {
  collection: NFTCollectionDetails | null;
  tokenDetails: NFTTokenDetails | null;
  userTradingDetails: NFTTokenTradingDetails | null;
  bids: Bids | null;
  highestBidAmount: HighestBidAmount;
  tokenLoaders: {
    [key: string]: boolean;
  } | null;
  tokenErrors: {
    [key: string]: boolean;
  } | null;
}

export enum TokenActionTypes {
  TOKEN_LOADING = 'TOKEN_LOADING',
  TOKEN_ERROR = 'TOKEN_ERROR',
  GET_TOKEN_DETAILS = 'GET_TOKEN_DETAILS',
  GET_COLLECTION = 'GET_COLLECTION',
  GET_USER_TRADING_DETAILS = 'GET_USER_TRADING_DETAILS',
  GET_BIDS = 'GET_BIDS',
}

interface TokenLoadingAction {
  type: TokenActionTypes.TOKEN_LOADING;
  payload: string;
}

interface TokenErrorAction {
  type: TokenActionTypes.TOKEN_ERROR;
  payload: string;
}

interface GetTokenDetailsAction {
  type: TokenActionTypes.GET_TOKEN_DETAILS;
  payload: NFTTokenDetails;
}

interface GetUserTradingDetailsAction {
  type: TokenActionTypes.GET_USER_TRADING_DETAILS;
  payload: NFTTokenTradingDetails | null;
}

interface GetCollectionAction {
  type: TokenActionTypes.GET_COLLECTION;
  payload: NFTCollectionDetails;
}

interface GetBidsAction {
  type: TokenActionTypes.GET_BIDS;
  payload: {
    bids: Bids;
    highestBidAmount: HighestBidAmount;
  };
}

export type TokenAction =
  | GetBidsAction
  | GetCollectionAction
  | GetUserTradingDetailsAction
  | GetTokenDetailsAction
  | TokenErrorAction
  | TokenLoadingAction;
