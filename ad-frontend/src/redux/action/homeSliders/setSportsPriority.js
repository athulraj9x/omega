import { SET_SPORTS_DATA_WITH_PRIORITY, SET_SPORTS_DATA_WITH_PRIORITY_SUCCESS, SET_SPORTS_DATA_WITH_PRIORITY_FAILURE } from "../types";

export const setSportsPriority = (payload) => ({
  type: SET_SPORTS_DATA_WITH_PRIORITY,
  payload,
});

export const setSportsPrioritySuccess = (payload) => ({
  type: SET_SPORTS_DATA_WITH_PRIORITY_SUCCESS,
  payload,
});

export const setSportsPriorityFailure = () => ({
  type: SET_SPORTS_DATA_WITH_PRIORITY_FAILURE,
});
