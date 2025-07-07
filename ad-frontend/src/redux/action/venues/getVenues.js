//this is for fetching Events from external Api

import {
  GET_BETFAIR_VENUES,
  GET_BETFAIR_VENUES_SUCCESS,
  GET_BETFAIR_VENUES_FAILURE,
} from "../types";

export const getVenues = (payload) => ({
  type: GET_BETFAIR_VENUES,
  payload,
});

export const getVenuesSuccess = (payload) => ({
  type: GET_BETFAIR_VENUES_SUCCESS,
  payload,
});

export const getVenuesFailure = () => ({
  type: GET_BETFAIR_VENUES_FAILURE,
});
