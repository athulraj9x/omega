import {
    SET_PRIORITY_LINE_MARKET,
    SET_PRIORITY_LINE_MARKET_SUCCESS,
    SET_PRIORITY_LINE_MARKET_FAILURE,
  } from "../types";
  
  export const setPriorityLineMarket = (payload) => ({
    type: SET_PRIORITY_LINE_MARKET,
    payload,
  });
  
  export const setPriorityLineMarketSuccess = (payload) => ({
    type: SET_PRIORITY_LINE_MARKET_SUCCESS,
    payload,
  });
  
  export const setPriorityLineMarketFailure = () => ({
    type: SET_PRIORITY_LINE_MARKET_FAILURE,
  });
  