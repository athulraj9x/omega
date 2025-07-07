import { GET_MARKET_ANALYSIS_DATA, GET_MARKET_ANALYSIS_DATA_SUCCESS, GET_MARKET_ANALYSIS_DATA_FAILURE } from "../types";

export const getMarketAnalysisData = (payload) => ({
  type: GET_MARKET_ANALYSIS_DATA,
  payload,
});

export const getMarketAnalysisDataSuccess = (payload) => ({
  type: GET_MARKET_ANALYSIS_DATA_SUCCESS,
  payload,
});

export const getMarketAnalysisDataFailure = () => ({
  type: GET_MARKET_ANALYSIS_DATA_FAILURE,
});
