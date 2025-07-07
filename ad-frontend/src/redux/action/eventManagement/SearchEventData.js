import { SEARCH_BASED_ON_EVENTS, SEARCH_BASED_ON_EVENTS_FAILURE, SEARCH_BASED_ON_EVENTS_SUCCESS } from "../types";

export const searchBasedOnEvents = (payload) => ( 
  {
  type: SEARCH_BASED_ON_EVENTS,
  payload,
});

export const searchBasedOnEventsSuccess = (payload) => ({
  type: SEARCH_BASED_ON_EVENTS_SUCCESS,
  payload,
});

export const searchBasedOnEventsFailure = () => ({
  type: SEARCH_BASED_ON_EVENTS_FAILURE,
});
