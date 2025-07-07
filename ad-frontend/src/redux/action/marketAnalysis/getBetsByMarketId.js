import { GET_BETS_BY_MARKET_ID, GET_BETS_BY_MARKET_ID_SUCCESS, GET_BETS_BY_MARKET_ID_FAILURE } from "../types";

export const getBetsByMarketId = (payload) => ({
  type: GET_BETS_BY_MARKET_ID,
  payload,
});

export const getBetsByMarketIdSuccess = (payload) => ({
  type: GET_BETS_BY_MARKET_ID_SUCCESS,
  payload,
});

export const getBetsByMarketIdFailure = () => ({
  type: GET_BETS_BY_MARKET_ID_FAILURE,
});
