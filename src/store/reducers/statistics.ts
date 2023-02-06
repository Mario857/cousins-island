import {
  StatisticsState,
  StatisticsAction,
  StatisticsActionTypes,
} from 'store/types/statistics.types';

const initialState: StatisticsState = {
  statisticsLoaders: null,
  lunaPrice: null,
};

const statisticsReducer = (state = initialState, action: StatisticsAction) => {
  switch (action.type) {
    case StatisticsActionTypes.GET_LUNA_PRICE:
      return {
        ...state,
        lunaPrice: action.payload,
        statisticsLoaders: {
          ...state.statisticsLoaders,
          getLunaPrice: false,
        },
      };
    case StatisticsActionTypes.STATISTICS_ERROR:
      return {
        ...state,
        statisticsLoaders: {
          ...state.statisticsLoaders,
          [action.payload]: false,
        },
      };
    case StatisticsActionTypes.STATISTICS_LOADING:
      return {
        ...state,
        statisticsLoaders: {
          ...state.statisticsLoaders,
          [action.payload]: true,
        },
      };
    default:
      return state;
  }
};

export default statisticsReducer;
