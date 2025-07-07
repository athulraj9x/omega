import {
  GET_ACCOUNTS_MANAGER_REPORTS,
  GET_ACCOUNTS_MANAGER_REPORTS_SUCCESS,
  GET_ACCOUNTS_MANAGER_REPORTS_FAILURE,
} from "../types";

export const getManagerReports = (payload) => ({
  type: GET_ACCOUNTS_MANAGER_REPORTS,
  payload,
});

export const getManagerReportsSuccess = (payload) => ({
  type: GET_ACCOUNTS_MANAGER_REPORTS_SUCCESS,
  payload,
});

export const getManagerReportsFailure = () => ({
  type: GET_ACCOUNTS_MANAGER_REPORTS_FAILURE,
});
