import {
  CollectionsAction,
  CollectionsActionTypes,
  CollectionsState,
} from 'store/types/collections.types';

const initialState: CollectionsState = {
  collectionsErrors: null,
  collectionsLoaders: {
    getCollections: true,
  },
  collections: null,
  newestCollections: null,
  oldestCollections: null,
  trendingCollections: null,
  collection: null,
};

const collectionsReducer = (
  state = initialState,
  action: CollectionsAction
) => {
  switch (action.type) {
    case CollectionsActionTypes.GET_COLLECTION:
      return {
        ...state,
        collection: {
          ...state.collection,
          ...action.payload,
        },
      };
    case CollectionsActionTypes.GET_COLLECTIONS:
      return {
        ...state,
        collections: action.payload.collections,
        newestCollections: action.payload.newestCollections,
        oldestCollections: action.payload.oldestCollections,
        trendingCollections: action.payload.trendingCollections,
        collectionsLoaders: {
          ...state.collectionsLoaders,
          getCollections: false,
        },
        collectionsErrors: {
          ...state.collectionsErrors,
          getCollections: false,
        },
      };
    case CollectionsActionTypes.COLLETIONS_LOADING:
      return {
        ...state,
        collectionsLoaders: {
          ...state.collectionsLoaders,
          [action.payload]: true,
        },
      };
    case CollectionsActionTypes.COLLECTIONS_ERROR:
      return {
        ...state,
        collectionsErrors: {
          ...state.collectionsErrors,
          [action.payload]: false,
        },
      };
    default:
      return state;
  }
};

export default collectionsReducer;
