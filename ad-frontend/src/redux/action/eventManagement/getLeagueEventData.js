import { GET_LEAGUE_EVENT_DATA, GET_LEAGUE_EVENT_DATA_FAILURE, GET_LEAGUE_EVENT_DATA_SUCCESS } from "../types";

export const getLeagueEventData = (payload) => ( 
  {
  type: GET_LEAGUE_EVENT_DATA,
  payload,
});

export const getLeagueEventDataSuccess = (payload) => ({
  type: GET_LEAGUE_EVENT_DATA_SUCCESS,
  payload,
});

export const getLeagueEventDataFailure = () => ({
  type: GET_LEAGUE_EVENT_DATA_FAILURE,
});
