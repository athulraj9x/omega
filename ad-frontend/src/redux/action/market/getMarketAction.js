//this is for fetching Markets from external Api

import {
  GET_MARKETS,
  GET_MARKETS_SUCCESS,
  GET_MARKETS_FAILURE,
} from "../types";

export const getMarkets = (payload) => ({
  type: GET_MARKETS,
  payload,
});

export const getMarketSuccess = (payload) => ({
  type: GET_MARKETS_SUCCESS,
  payload,
});

export const getMarketFailure = () => ({
  type: GET_MARKETS_FAILURE,
});
