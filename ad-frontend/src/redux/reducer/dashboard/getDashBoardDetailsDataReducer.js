//this is for fetching Runners from external Api

import {
    DASHBOARD_DETAILS,
    DASHBOARD_DETAILS_SUCCESS,
    DASHBOARD_DETAILS_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    dashboardDetails: null,
  };
  
  const getDashboardDataDetailsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case DASHBOARD_DETAILS:
        return { ...state,dashboardDetails: action.payload, loading: true };
      case DASHBOARD_DETAILS_SUCCESS:
        return { ...state, dashboardDetails: action.payload, loading: false };
      case DASHBOARD_DETAILS_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getDashboardDataDetailsReducer;
  