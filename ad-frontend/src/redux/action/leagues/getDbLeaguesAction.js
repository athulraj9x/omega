import {
  GET_DBLEAGUES,
  GET_DBLEAGUES_SUCCESS,
  GET_DBLEAGUES_FAILURE,
} from "../types";

export const getDbLeagues = (payload) => ({
  type: GET_DBLEAGUES,
  payload
});

export const getDbLeagueSuccess = (payload) => ({
  type: GET_DBLEAGUES_SUCCESS,
  payload,
});

export const getDbLeagueFailure = () => ({
  type: GET_DBLEAGUES_FAILURE,
});
