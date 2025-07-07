import {
  ADD_NEW_MARKET,
  ADD_NEW_MARKET_SUCCESS,
  ADD_NEW_MARKET_FAILURE,
} from "../types";

export const addNewMarket = (payload) => ({
  type: ADD_NEW_MARKET,
  payload,
});

export const addNewMarketSuccess = (payload) => ({
  type: ADD_NEW_MARKET_SUCCESS,
  payload,
});

export const addNewMarketFailure = () => ({
  type: ADD_NEW_MARKET_FAILURE,
});
