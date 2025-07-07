import {
    GET_PRIORITY_DATA_BASED_EVENT_MARKET,
    GET_PRIORITY_DATA_BASED_EVENT_MARKET_SUCCESS,
    GET_PRIORITY_DATA_BASED_EVENT_MARKET_FAILURE,
  } from "../types";
  
  export const getPriorityEventMarketAction = (payload) => ({
    type: GET_PRIORITY_DATA_BASED_EVENT_MARKET,
    payload,
  });
  
  export const getPriorityEventMarketActionSuccess = (payload) => ({
    type: GET_PRIORITY_DATA_BASED_EVENT_MARKET_SUCCESS,
    payload,
  });
  
  export const getPriorityEventMarketActionFailure = () => ({
    type: GET_PRIORITY_DATA_BASED_EVENT_MARKET_FAILURE,
  });
  