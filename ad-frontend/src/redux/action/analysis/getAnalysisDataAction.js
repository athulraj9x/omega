//this is for fetching Events from external Api

import {
  GET_ANALYSIS_DATAS,
  GET_ANALYSIS_DATAS_SUCCESS,
  GET_ANALYSIS_DATAS_FAILURE,
} from "../types";
export const getAnalysisData = (payload) => ({
  type: GET_ANALYSIS_DATAS,
  payload,
});

export const getAnalysisDataSuccess = (payload) => ({
  type: GET_ANALYSIS_DATAS_SUCCESS,
  payload,
});

export const getAnalysisDataFailure = () => ({
  type: GET_ANALYSIS_DATAS_FAILURE,
});
