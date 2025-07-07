import {
  ADD_RACE_EVENTS,
  ADD_RACE_EVENTS_SUCCESS,
  ADD_RACE_EVENTS_FAILURE,
} from "../types";

export const addRaceEvent = (payload) => ({
  type: ADD_RACE_EVENTS,
  payload,
});

export const addRaceEventSuccess = (payload) => ({
  type: ADD_RACE_EVENTS_SUCCESS,
  payload,
});

export const addRaceEventFailure = () => ({
  type: ADD_RACE_EVENTS_FAILURE,
});
