import {
  GET_EVENT_MARKET,
  GET_EVENT_MARKET_SUCCESS,
  GET_EVENT_MARKET_FAILURE,
} from "../types";

export const getEventMarket = (payload) => ({
  type: GET_EVENT_MARKET,
  payload,
});

export const getEventMarketSuccess = (payload) => ({
  type: GET_EVENT_MARKET_SUCCESS,
  payload,
});

export const getEventMarketFailure = () => ({
  type: GET_EVENT_MARKET_FAILURE,
});
