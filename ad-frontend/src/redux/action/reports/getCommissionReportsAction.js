import {
  GET_COMMISSION_REPORTS,
  GET_COMMISSION_REPORTS_SUCCESS,
  GET_COMMISSION_REPORTS_FAILURE,
} from "../types";

export const getCommissionReports = (payload) => ({
  type: GET_COMMISSION_REPORTS,
  payload,
});

export const getCommissionReportsSuccess = (payload) => ({
  type: GET_COMMISSION_REPORTS_SUCCESS,
  payload,
});

export const getCommissionReportsFailure = () => ({
  type: GET_COMMISSION_REPORTS_FAILURE,
});
 