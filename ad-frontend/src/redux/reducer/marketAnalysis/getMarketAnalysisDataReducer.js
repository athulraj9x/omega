import {
    GET_MARKET_ANALYSIS_DATA,
    GET_MARKET_ANALYSIS_DATA_FAILURE,
    GET_MARKET_ANALYSIS_DATA_SUCCESS,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    data: null,
  };
  
  const getBetsAnalysisDataReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_MARKET_ANALYSIS_DATA:
        return { ...state, loading: true };
      case GET_MARKET_ANALYSIS_DATA_SUCCESS:
        return { ...state, data: action.payload, loading: false };
      case GET_MARKET_ANALYSIS_DATA_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getBetsAnalysisDataReducer;
  