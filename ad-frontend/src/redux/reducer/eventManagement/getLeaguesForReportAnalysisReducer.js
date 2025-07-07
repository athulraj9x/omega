import {
  GET_REPORT_ANALYSIS_LEAGUES,
  GET_REPORT_ANALYSIS_LEAGUES_SUCCESS,
  GET_REPORT_ANALYSIS_LEAGUES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  leagues: null,
};

const GetLeaguesForReportAnalysisReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REPORT_ANALYSIS_LEAGUES:
      return { ...state, loading: true };
    case GET_REPORT_ANALYSIS_LEAGUES_SUCCESS:
      return { ...state, leagues: action.payload, loading: false };
    case GET_REPORT_ANALYSIS_LEAGUES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default GetLeaguesForReportAnalysisReducer;
