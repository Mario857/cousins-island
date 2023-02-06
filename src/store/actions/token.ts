import { TokenAction, TokenActionTypes } from 'store/types/token.types';
import blockchain from 'utils/blockchain/blockchain';
import {
  NFTTokenDetails,
  NFTTokenTradingDetails,
  Bid,
} from 'utils/blockchain/blockchain.interface';
import { Dispatch } from 'redux';

export const removeBidFromTokenBids =
  (bidOrderId: string, highestToLowestBids: Bid[]) =>
  async (dispatch: Dispatch<TokenAction>) => {
    const loadingName = 'removeBidFromTokenBids';

    dispatch({ type: TokenActionTypes.TOKEN_LOADING, payload: loadingName });

    try {
      const lunaPrice = await blockchain.getLunaPrice();

      const highestToLowest = [...highestToLowestBids].filter(
        (bid) => bid.bidOrderId !== bidOrderId
      );
      const lowestToHighest = [...highestToLowest].reverse();

      const highestBidAmount = getHighestBidAmount(highestToLowest, lunaPrice);

      dispatch({
        type: TokenActionTypes.GET_BIDS,
        payload: {
          bids: {
            highestToLowest,
            lowestToHighest,
          },
          highestBidAmount,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: TokenActionTypes.TOKEN_ERROR,
        payload: loadingName,
      });
    }
  };

export const getAllBidsForToken =
  (nftContractAddress: string, tokenId: string) =>
  async (dispatch: Dispatch<TokenAction>) => {
    const loadingName = 'getAllBidsForToken';

    dispatch({
      type: TokenActionTypes.TOKEN_LOADING,
      payload: loadingName,
    });

    try {
      const bids = await blockchain.getAllBidsForToken(
        nftContractAddress,
        tokenId
      );

      const lunaPrice = await blockchain.getLunaPrice();

      const highestToLowest = getHighestToLowestBids(bids, lunaPrice);
      const lowestToHighest = [...highestToLowest].reverse();

      const highestBidAmount = getHighestBidAmount(highestToLowest, lunaPrice);

      dispatch({
        type: TokenActionTypes.GET_BIDS,
        payload: {
          bids: {
            highestToLowest,
            lowestToHighest,
          },
          highestBidAmount,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: TokenActionTypes.TOKEN_ERROR,
        payload: loadingName,
      });
    }
  };

const getHighestToLowestBids = (bids: Bid[], lunaPrice: number) =>
  bids.sort((bid1, bid2) => {
    const amount1 = bid1.amount || 0;
    const amount2 = bid2.amount || 0;

    const lunaAmount1 = bid1.currency === 'UST' ? amount1 / lunaPrice : amount1;
    const lunaAmount2 = bid2.currency === 'UST' ? amount2 / lunaPrice : amount2;

    return lunaAmount2 - lunaAmount1;
  });

const getHighestBidAmount = (highestToLowestBids: Bid[], lunaPrice: number) => {
  if (highestToLowestBids.length > 0) {
    const highestBid = highestToLowestBids[0];

    const amount = highestBid.amount || 0;

    const luna = highestBid.currency === 'LUNA' ? amount : amount / lunaPrice;

    const ust = luna * lunaPrice;

    return {
      luna,
      ust,
    };
  } else {
    return {
      luna: null,
      ust: null,
    };
  }
};

export const getCollection =
  (nftContractAddress: string) => async (dispatch: Dispatch<TokenAction>) => {
    const loadingName = 'getCollection';

    dispatch({
      type: TokenActionTypes.TOKEN_LOADING,
      payload: loadingName,
    });

    try {
      const collection = await blockchain.getNFTCollection(nftContractAddress);
      dispatch({ type: TokenActionTypes.GET_COLLECTION, payload: collection });
    } catch (error) {
      console.log(error);
      dispatch({
        type: TokenActionTypes.TOKEN_ERROR,
        payload: loadingName,
      });
    }
  };

export const getUserTradingDetails =
  (nftContractAddress: string, tokenId: string) =>
  async (dispatch: Dispatch<TokenAction>) => {
    const loadingName = 'getUserTradingDetails';

    dispatch({
      type: TokenActionTypes.TOKEN_LOADING,
      payload: loadingName,
    });

    try {
      const userTradingDetails = await blockchain.getTokenTradingDetailsForUser(
        nftContractAddress,
        tokenId
      );
      dispatch({
        type: TokenActionTypes.GET_USER_TRADING_DETAILS,
        payload: userTradingDetails,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: TokenActionTypes.GET_USER_TRADING_DETAILS,
        payload: null,
      });
      dispatch({
        type: TokenActionTypes.TOKEN_ERROR,
        payload: loadingName,
      });
    }
  };

export const updateUserTradingDetails = (
  updatedUserTradingDetails: NFTTokenTradingDetails
) => {
  return {
    type: TokenActionTypes.GET_USER_TRADING_DETAILS,
    payload: updatedUserTradingDetails,
  };
};

export const getTokenDetails =
  (nftContractAddress: string, tokenId: string) =>
  async (dispatch: Dispatch<TokenAction>) => {
    const loadingName = 'getTokenDetails';

    dispatch({
      type: TokenActionTypes.TOKEN_LOADING,
      payload: loadingName,
    });

    try {
      const tokenDetails = await blockchain.getTokenDetails(
        nftContractAddress,
        tokenId
      );

      dispatch({
        type: TokenActionTypes.GET_TOKEN_DETAILS,
        payload: tokenDetails,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: TokenActionTypes.TOKEN_ERROR,
        payload: loadingName,
      });
    }
  };

export const updateTokenDetails = (updatedTokenDetails: NFTTokenDetails) => {
  return {
    type: TokenActionTypes.GET_USER_TRADING_DETAILS,
    payload: updatedTokenDetails,
  };
};
