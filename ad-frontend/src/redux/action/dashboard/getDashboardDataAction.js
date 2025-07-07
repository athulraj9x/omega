//this is for fetching Sports from external Api

import { GET_DASHBOARD_DATA, GET_DASHBOARD_DATA_SUCCESS, GET_DASHBOARD_DATA_FAILURE } from "../types";

export const getDashboardData = (payload) => ({
  type: GET_DASHBOARD_DATA,
  payload
});

export const getDashboardDataSuccess = (payload) => ({
  type: GET_DASHBOARD_DATA_SUCCESS,
  payload,
});

export const getDashboardDataFailure = () => ({
  type: GET_DASHBOARD_DATA_FAILURE,
});
