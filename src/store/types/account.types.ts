import {
  Balance,
  Bid,
  NFTTokenDetails,
} from 'utils/blockchain/blockchain.interface';

interface TerraBalance {
  ust: number;
  luna: number;
  luart: number;
}

export interface AccountState {
  ownedTokens: {
    [key: string]: NFTTokenDetails[];
  } | null;
  ownedTokensCount: {
    [key: string]: number;
  } | null;
  onSaleTokens: NFTTokenDetails[] | null;
  balance: TerraBalance;
  depositedBalance: Balance | null;
  accountLoaders: {
    [key: string]: boolean;
  } | null;
  accountErrors: {
    [key: string]: boolean;
  } | null;
  bids: Bid[] | null;
}

export enum AccountActionTypes {
  ACCOUNT_LOADING = 'ACCOUNT_LOADING',
  ACCOUNT_ERROR = 'ACCOUNT_ERROR',
  GET_OWNED_TOKENS = 'GET_OWNED_TOKENS',
  GET_OWNED_TOKENS_COUNT = 'GET_OWNED_TOKENS_COUNT',
  GET_ON_SALE_TOKENS = 'GET_ON_SALE_TOKENS',
  GET_BALANCE = 'GET_BALANCE',
  GET_BIDS = 'GET_BIDS_FOR_USER',
  REMOVE_BID = 'REMOVE_BID',
  GET_DEPOSITED_BALANCE = 'GET_DEPOSITED_BALANCE',
}

interface AccountLoadingAction {
  type: AccountActionTypes.ACCOUNT_LOADING;
  payload: string;
}

interface AccountErrorAction {
  type: AccountActionTypes.ACCOUNT_ERROR;
  payload: string;
}

interface GetOwnedTokensAction {
  type: AccountActionTypes.GET_OWNED_TOKENS;
  payload: {
    [key: string]: NFTTokenDetails[];
  };
}

interface GetOwnedTokensCountAction {
  type: AccountActionTypes.GET_OWNED_TOKENS_COUNT;
  payload: {
    [key: string]: number;
  };
}

interface GetOnSaleTokensAction {
  type: AccountActionTypes.GET_ON_SALE_TOKENS;
  payload: NFTTokenDetails[];
}

interface GetBalanceAction {
  type: AccountActionTypes.GET_BALANCE;
  payload: TerraBalance;
}

interface GetBidsAction {
  type: AccountActionTypes.GET_BIDS;
  payload: Bid[];
}

interface RemoveBidAction {
  type: AccountActionTypes.REMOVE_BID;
  payload: string;
}

interface GetDepositedBalanceAction {
  type: AccountActionTypes.GET_DEPOSITED_BALANCE;
  payload: Balance;
}

export type AccountAction =
  | GetDepositedBalanceAction
  | RemoveBidAction
  | GetBidsAction
  | GetOwnedTokensAction
  | GetOwnedTokensCountAction
  | GetOnSaleTokensAction
  | GetBalanceAction
  | AccountLoadingAction
  | AccountErrorAction;
