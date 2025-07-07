//this is for fetching Runners from external Api

import {
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  dashboardData: null,
};

const getDashboardDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DASHBOARD_DATA:
      return { ...state,dashboardData: action.payload, loading: true };
    case GET_DASHBOARD_DATA_SUCCESS:
      return { ...state, dashboardData: action.payload, loading: false };
    case GET_DASHBOARD_DATA_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getDashboardDataReducer;
