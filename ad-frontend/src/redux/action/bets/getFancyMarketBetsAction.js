import {
  GET_FANCY_MARKET_BETS,
  GET_FANCY_MARKET_BETS_SUCCESS,
  GET_FANCY_MARKET_BETS_FAILURE,
} from "../types";

export const getFancyMarketBets = (payload) => ({
  type: GET_FANCY_MARKET_BETS,
  payload,
});

export const getFancyMarketBetsSuccess = (payload) => ({
  type: GET_FANCY_MARKET_BETS_SUCCESS,
  payload,
});

export const getFancyMarketBetsFailure = () => ({
  type: GET_FANCY_MARKET_BETS_FAILURE,
});
