import {
  GET_BETS_OF_RUNNING_MARKET,
  GET_BETS_OF_RUNNING_MARKET_SUCCESS,
  GET_BETS_OF_RUNNING_MARKET_FAILURE,
} from "../types";

export const getBetsOfRunningMarket = (payload) => ({
  type: GET_BETS_OF_RUNNING_MARKET,
  payload,
});

export const getBetsOfRunningMarketSuccess = (payload) => ({
  type: GET_BETS_OF_RUNNING_MARKET_SUCCESS,
  payload,
});

export const getBetsOfRunningMarketFailure = () => ({
  type: GET_BETS_OF_RUNNING_MARKET_FAILURE,
});
