import {
  NFTCollectionDetails,
  NFTTokenDetails,
} from 'utils/blockchain/blockchain.interface';

interface Collection {
  details: NFTCollectionDetails;
  tokens: {
    pagesCount: number;
    data: NFTTokenDetails[];
    totalResults: number;
  };
}

export interface CollectionsState {
  collectionsLoaders: { [key: string]: boolean } | null;
  collectionsErrors: { [key: string]: boolean } | null;
  collections: null | NFTCollectionDetails[];
  newestCollections: null | NFTCollectionDetails[];
  oldestCollections: null | NFTCollectionDetails[];
  trendingCollections: null | NFTCollectionDetails[];
  collection: Collection | null;
}

export enum CollectionsActionTypes {
  COLLETIONS_LOADING = 'COLLETIONS_LOADING',
  COLLECTIONS_ERROR = 'COLLECTIONS_ERROR',
  GET_COLLECTIONS = 'GET_COLLECTIONS',
  GET_COLLECTION = 'GET_COLLECTION',
  GET_COLLECTIONS_VOLUMES = 'GET_COLLECTIONS_VOLUMES',
}

interface CollectionsLoadingAction {
  type: CollectionsActionTypes.COLLETIONS_LOADING;
  payload: string;
}

interface CollectionsErrorAction {
  type: CollectionsActionTypes.COLLECTIONS_ERROR;
  payload: string;
}

interface GetCollectionsAction {
  type: CollectionsActionTypes.GET_COLLECTIONS;
  payload: {
    collections: NFTCollectionDetails[];
    newestCollections: NFTCollectionDetails[];
    oldestCollections: NFTCollectionDetails[];
    trendingCollections: NFTCollectionDetails[];
  };
}

interface GetCollectionAction {
  type: CollectionsActionTypes.GET_COLLECTION;
  payload: Collection;
}

export type CollectionsAction =
  | CollectionsLoadingAction
  | CollectionsErrorAction
  | GetCollectionsAction
  | GetCollectionAction;
