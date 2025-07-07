import {
  GET_CASINO_BETS_REPORT,
  GET_CASINO_BETS_REPORT_SUCCESS,
  GET_CASINO_BETS_REPORT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  casinoBetsData: null,
};

const getCasinoBetsReportReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CASINO_BETS_REPORT:
      return { ...state, loading: true };
    case GET_CASINO_BETS_REPORT_SUCCESS:
      return { ...state, casinoBetsData: action.payload, loading: false };
    case GET_CASINO_BETS_REPORT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getCasinoBetsReportReducer;
