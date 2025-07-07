//this is for fetching Sports from external Api

import { GET_BETFAIR_BALANCE, GET_BETFAIR_BALANCE_SUCCESS, GET_BETFAIR_BALANCE_FAILURE } from "../types";

export const getBetfairBalance = (payload) => ({
  type: GET_BETFAIR_BALANCE,
  payload
});

export const getBetfairBalanceSuccess = (payload) => ({
  type: GET_BETFAIR_BALANCE_SUCCESS,
  payload,
});

export const getBetfairBalanceFailure = () => ({
  type: GET_BETFAIR_BALANCE_FAILURE,
});
