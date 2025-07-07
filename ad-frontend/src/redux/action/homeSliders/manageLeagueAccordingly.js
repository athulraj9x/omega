import { GET_LEAGUE_DATA_WITH_PRIORITY, GET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS, GET_LEAGUE_DATA_WITH_PRIORITY_FAILURE } from "../types";

export const getLeagueDataWithPriority = (payload) => ({
  type: GET_LEAGUE_DATA_WITH_PRIORITY,
  payload,
});

export const getLeagueDataWithPrioritySuccess = (payload) => ({
  type: GET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS,
  payload,
});

export const getLeagueDataWithPriorityFailure = () => ({
  type: GET_LEAGUE_DATA_WITH_PRIORITY_FAILURE,
});
