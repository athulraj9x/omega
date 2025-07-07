import {
  UPDATE_BETFAIR_SHARES,
  UPDATE_BETFAIR_SHARES_SUCCESS,
  UPDATE_BETFAIR_SHARES_FAILURE,
} from "../types";

export const updateBetfairShare = (payload) => ({
  type: UPDATE_BETFAIR_SHARES,
  payload,
});

export const updateBetfairShareSuccess = (payload) => ({
  type: UPDATE_BETFAIR_SHARES_SUCCESS,
  payload,
});

export const updateBetfairShareFailure = () => ({
  type: UPDATE_BETFAIR_SHARES_FAILURE,
});
