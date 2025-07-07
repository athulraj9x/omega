//this is for fetching Events from external Api

import { GET_EVENTS, GET_EVENTS_SUCCESS, GET_EVENTS_FAILURE } from "../types";

export const getEvents = (payload) => ({
  type: GET_EVENTS,
  payload,
});

export const getEventSuccess = (payload) => ({
  type: GET_EVENTS_SUCCESS,
  payload,
});

export const getEventFailure = () => ({
  type: GET_EVENTS_FAILURE,
});
