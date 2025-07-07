import {
  GET_CASINO_BETS_REPORT,
  GET_CASINO_BETS_REPORT_SUCCESS,
  GET_CASINO_BETS_REPORT_FAILURE,
} from "../types";

export const getCasinoBetsReport = (payload) => ({
  type: GET_CASINO_BETS_REPORT,
  payload,
});

export const getCasinoBetsReportSuccess = (payload) => ({
  type: GET_CASINO_BETS_REPORT_SUCCESS,
  payload,
});

export const getCasinoBetsReportFailure = () => ({
  type: GET_CASINO_BETS_REPORT_FAILURE,
});
