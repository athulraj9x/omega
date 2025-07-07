//this is for fetching Runners from external Api

import {
    GET_BETFAIR_BALANCE, GET_BETFAIR_BALANCE_SUCCESS, GET_BETFAIR_BALANCE_FAILURE
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    dashboardData: null,
  };
  
  const getBetfairBalanceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_BETFAIR_BALANCE:
        return { ...state,dashboardData: action.payload, loading: true };
      case GET_BETFAIR_BALANCE_SUCCESS:
        return { ...state, dashboardData: action.payload, loading: false };
      case GET_BETFAIR_BALANCE_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getBetfairBalanceReducer;
  