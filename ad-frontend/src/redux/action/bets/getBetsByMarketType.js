import {
  GET_BET_BY_MARKETTYPE,
  GET_BET_BY_MARKETTYPE_SUCCESS,
  GET_BET_BY_MARKETTYPE_FAILURE,
} from "../types";

export const getBetByMarketType = (payload) => ({
  type: GET_BET_BY_MARKETTYPE,
  payload,
});

export const getBetByMarketTypeSuccess = (payload) => ({
  type: GET_BET_BY_MARKETTYPE_SUCCESS,
  payload,
});

export const getBetByMarketTypeFailure = () => ({
  type: GET_BET_BY_MARKETTYPE_FAILURE,
});
