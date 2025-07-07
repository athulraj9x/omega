import {
  GET_LINE_MARKET_BETS,
  GET_LINE_MARKET_BETS_SUCCESS,
  GET_LINE_MARKET_BETS_FAILURE,
} from "../types";

export const getLineMarketBets = (payload) => ({
  type: GET_LINE_MARKET_BETS,
  payload,
});

export const getLineMarketBetsSuccess = (payload) => ({
  type: GET_LINE_MARKET_BETS_SUCCESS,
  payload,
});

export const getLineMarketBetsFailure = () => ({
  type: GET_LINE_MARKET_BETS_FAILURE,
});
