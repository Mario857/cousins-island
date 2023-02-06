import { StatisticsActionTypes } from 'store/types/statistics.types';
import blockchainModule from 'utils/blockchain/blockchain';
import { Dispatch } from 'redux';

export const getLunaPrice = () => async (dispatch: Dispatch) => {
  const loadingName = 'getLunaPrice';

  dispatch({
    type: StatisticsActionTypes.STATISTICS_LOADING,
    payload: loadingName,
  });

  try {
    const lunaPrice = await blockchainModule.getLunaPrice();

    dispatch({
      type: StatisticsActionTypes.GET_LUNA_PRICE,
      payload: lunaPrice,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: StatisticsActionTypes.STATISTICS_ERROR,
      payload: loadingName,
    });
  }
};
