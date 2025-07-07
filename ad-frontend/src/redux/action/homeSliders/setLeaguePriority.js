import { SET_LEAGUE_DATA_WITH_PRIORITY, SET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS, SET_LEAGUE_DATA_WITH_PRIORITY_FAILURE } from "../types";

export const setLeaguePriority = (payload) => ({
  type: SET_LEAGUE_DATA_WITH_PRIORITY,
  payload,
});

export const setLeaguePrioritySuccess = (payload) => ({
  type: SET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS,
  payload,
});

export const setLeaguePriorityFailure = () => ({
  type: SET_LEAGUE_DATA_WITH_PRIORITY_FAILURE,
});
