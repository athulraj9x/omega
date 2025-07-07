import {
  GET_VIEW_BETS_OF_RUNNING_MARKET,
  GET_VIEW_BETS_OF_RUNNING_MARKET_SUCCESS,
  GET_VIEW_BETS_OF_RUNNING_MARKET_FAILURE,
} from "../types";

export const getViewBetsOfRunningMarket = (payload) => ({
  type: GET_VIEW_BETS_OF_RUNNING_MARKET,
  payload,
});

export const getViewBetsOfRunningMarketSuccess = (payload) => ({
  type: GET_VIEW_BETS_OF_RUNNING_MARKET_SUCCESS,
  payload,
});

export const getViewBetsOfRunningMarketFailure = () => ({
  type: GET_VIEW_BETS_OF_RUNNING_MARKET_FAILURE,
});
