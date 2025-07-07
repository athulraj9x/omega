//this is for fetching Leagues from external Api

import {
  GET_LEAGUES,
  GET_LEAGUES_SUCCESS,
  GET_LEAGUES_FAILURE,
} from "../types";

export const getLeagues = (payload) => ({
  type: GET_LEAGUES,
  payload,
});

export const getLeagueSuccess = (payload) => ({
  type: GET_LEAGUES_SUCCESS,
  payload,
});

export const getLeagueFailure = () => ({
  type: GET_LEAGUES_FAILURE,
});
