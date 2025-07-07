import {
  GET_LINE_MARKETS,
  GET_LINE_MARKETS_SUCCESS,
  GET_LINE_MARKETS_FAILURE,
} from "../types";

export const getLineMarkets = (payload) => ({
  type: GET_LINE_MARKETS,
  payload,
});

export const getLineMarketsSuccess = (payload) => ({
  type: GET_LINE_MARKETS_SUCCESS,
  payload,
});

export const getLineMarketsFailure = () => ({
  type: GET_LINE_MARKETS_FAILURE,
});
