//this is for fetching Events from external Api

import {
  GET_ANALYSIS_DATAS,
  GET_ANALYSIS_DATAS_SUCCESS,
  GET_ANALYSIS_DATAS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  analysisData: null,
};

const getAnalysisDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ANALYSIS_DATAS:
      return { ...state, loading: true };
    case GET_ANALYSIS_DATAS_SUCCESS:
      return { ...state, analysisData: action.payload, loading: false };
    case GET_ANALYSIS_DATAS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getAnalysisDataReducer;
