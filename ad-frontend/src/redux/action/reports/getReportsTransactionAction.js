import {
  GET_REPORT_TRANSACTION,
  GET_REPORT_TRANSACTION_SUCCESS,
  GET_REPORT_TRANSACTION_FAILURE,
} from "../types";

export const getReportTransation = (payload) => ({
  type: GET_REPORT_TRANSACTION,
  payload,
});

export const getReportTransationSuccess = (payload) => ({
  type: GET_REPORT_TRANSACTION_SUCCESS,
  payload,
});

export const getReportTransationFailure = () => ({
  type: GET_REPORT_TRANSACTION_FAILURE,
});
