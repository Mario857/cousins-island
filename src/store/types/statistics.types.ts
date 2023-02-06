export interface StatisticsState {
  statisticsLoaders: {
    [key: string]: boolean;
  } | null;
  lunaPrice: null | number;
}

export enum StatisticsActionTypes {
  STATISTICS_LOADING = 'STATISTICS_LOADING',
  STATISTICS_ERROR = 'STATISTICS_ERROR',
  GET_LUNA_PRICE = 'GET_LUNA_PRICE',
}

interface StatisticsLoadingAction {
  type: StatisticsActionTypes.STATISTICS_LOADING;
  payload: string;
}

interface StatisticsErrorAction {
  type: StatisticsActionTypes.STATISTICS_ERROR;
  payload: string;
}

interface GetLunaPriceAction {
  type: StatisticsActionTypes.GET_LUNA_PRICE;
  payload: number;
}

export type StatisticsAction =
  | StatisticsLoadingAction
  | StatisticsErrorAction
  | GetLunaPriceAction;
