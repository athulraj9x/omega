import {
  DELETE_EVENT_DATA,
  DELETE_EVENT_DATA_SUCCESS,
  DELETE_EVENT_DATA_FAILURE,
} from "../types";

export const deleteEventData = (payload) => ({
  type: DELETE_EVENT_DATA,
  payload,
});

export const deleteEventDataSuccess = (payload) => ({
  type: DELETE_EVENT_DATA_SUCCESS,
  payload,
});

export const deleteEventDataFailure = () => ({
  type: DELETE_EVENT_DATA_FAILURE,
});
