import {
  GET_REPORT_ANALYSIS_EVENTS,
  GET_REPORT_ANALYSIS_EVENTS_SUCCESS,
  GET_REPORT_ANALYSIS_EVENTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  events: null,
};

const GetEventsForReportAnalysisReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REPORT_ANALYSIS_EVENTS:
      return { ...state, loading: true };
    case GET_REPORT_ANALYSIS_EVENTS_SUCCESS:
      return { ...state, events: action.payload, loading: false };
    case GET_REPORT_ANALYSIS_EVENTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default GetEventsForReportAnalysisReducer;
