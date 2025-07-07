//this is for fetching Events from external Api

import {
  GET_BETFAIR_TIMERANGES,
  GET_BETFAIR_TIMERANGES_SUCCESS,
  GET_BETFAIR_TIMERANGES_FAILURE,
} from "../types";

export const getBetfairTimeRanges = (payload) => ({
  type: GET_BETFAIR_TIMERANGES,
  payload,
});

export const getBetfairTimeRangesSuccess = (payload) => ({
  type: GET_BETFAIR_TIMERANGES_SUCCESS,
  payload,
});

export const getBetfairTimeRangesFailure = () => ({
  type: GET_BETFAIR_TIMERANGES_FAILURE,
});
