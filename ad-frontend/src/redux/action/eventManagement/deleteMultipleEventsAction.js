import {
  DELETE_MULTIPLE_EVENTS,
  DELETE_MULTIPLE_EVENTS_SUCCESS,
  DELETE_MULTIPLE_EVENTS_FAILURE,
} from "../types";

export const deleteMultipleEvents = (payload) => ({
  type: DELETE_MULTIPLE_EVENTS,
  payload,
});

export const deleteMultipleEventSuccess = () => ({
  type: DELETE_MULTIPLE_EVENTS_SUCCESS,
});

export const deleteMultipleEventFailure = () => ({
  type: DELETE_MULTIPLE_EVENTS_FAILURE,
});
