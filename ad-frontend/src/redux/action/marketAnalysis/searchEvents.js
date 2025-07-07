import { SEARCH_EVENT_DATA, SEARCH_EVENT_DATA_SUCCESS, SEARCH_EVENT_DATA_FAILURE } from "../types";

export const searchEventData = (payload) => ({
  type: SEARCH_EVENT_DATA,
  payload,
});

export const searchEventDataSuccess = (payload) => ({
  type: SEARCH_EVENT_DATA_SUCCESS,
  payload,
});

export const searchEventDataFailure = () => ({
  type: SEARCH_EVENT_DATA_FAILURE,
});
