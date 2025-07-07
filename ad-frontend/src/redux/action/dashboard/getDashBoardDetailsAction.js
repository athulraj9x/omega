import {
  DASHBOARD_DETAILS,
  DASHBOARD_DETAILS_SUCCESS,
  DASHBOARD_DETAILS_FAILURE,
} from "../types";

export const getDashboardDataDetails = (payload) => ({
  type: DASHBOARD_DETAILS,
  payload,
});

export const getDashboardDataDetailsSuccess = (payload) => ({
  type: DASHBOARD_DETAILS_SUCCESS,
  payload,
});

export const getDashboardDataDetailsFailure = () => ({
  type: DASHBOARD_DETAILS_FAILURE,
});
