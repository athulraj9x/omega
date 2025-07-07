import {
  GET_DBEVENT,
  GET_DBEVENT_SUCCESS,
  GET_DBEVENT_FAILURE,
} from "../types";

export const getDbEvent = () => ({
  type: GET_DBEVENT,
});

export const getDbEventSuccess = (payload) => ({
  type: GET_DBEVENT_SUCCESS,
  payload,
});

export const getDbEventFailure = () => ({
  type: GET_DBEVENT_FAILURE,
});
