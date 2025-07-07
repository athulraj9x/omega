import { GET_SPORTS_DATA_WITH_PRIORITY, GET_SPORTS_DATA_WITH_PRIORITY_SUCCESS, GET_SPORTS_DATA_WITH_PRIORITY_FAILURE } from "../types";

export const getSportsDataWithPriority = (payload) => ({
  type: GET_SPORTS_DATA_WITH_PRIORITY,
  payload,
});

export const getSportsDataWithPrioritySuccess = (payload) => ({
  type: GET_SPORTS_DATA_WITH_PRIORITY_SUCCESS,
  payload,
});

export const getSportsDataWithPriorityFailure = () => ({
  type: GET_SPORTS_DATA_WITH_PRIORITY_FAILURE,
});
