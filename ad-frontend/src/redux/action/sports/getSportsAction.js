//this is for fetching Sports from external Api

import { GET_SPORTS, GET_SPORTS_SUCCESS, GET_SPORTS_FAILURE } from "../types";

export const getSports = () => ({
  type: GET_SPORTS,
});

export const getSportsSuccess = (payload) => ({
  type: GET_SPORTS_SUCCESS,
  payload,
});

export const getSportsFailure = () => ({
  type: GET_SPORTS_FAILURE,
});
