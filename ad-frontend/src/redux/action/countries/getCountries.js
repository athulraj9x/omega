//this is for fetching Events from external Api

import {
  GET_BETFAIR_COUNTRIES,
  GET_BETFAIR_COUNTRIES_SUCCESS,
  GET_BETFAIR_COUNTRIES_FAILURE,
} from "../types";

export const getBetfairCountries = (payload) => ({
  type: GET_BETFAIR_COUNTRIES,
  payload,
});

export const getBetfairCountrySuccess = (payload) => ({
  type: GET_BETFAIR_COUNTRIES_SUCCESS,
  payload,
});

export const getBetfairCountryFailure = () => ({
  type: GET_BETFAIR_COUNTRIES_FAILURE,
});
