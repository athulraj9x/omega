import {
  GET_USERBETS_EVENT,
  GET_USERBETS_EVENT_SUCCESS,
  GET_USERBETS_EVENT_FAILURE,
} from "../types";

export const getUserBetsEvent = (payload) => ({
  type: GET_USERBETS_EVENT,
  payload,
});

export const getUserBetsEventSuccess = (payload) => ({
  type: GET_USERBETS_EVENT_SUCCESS,
  payload,
});

export const getUserBetsEventFailure = () => ({
  type: GET_USERBETS_EVENT_FAILURE,
});
