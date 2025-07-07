import {
    ADD_HORSE_RACE_MATCH_ALL,
    ADD_HORSE_RACE_MATCH_ALL_SUCCESS,
    ADD_HORSE_RACE_MATCH_ALL_FAILURE,
  } from "../types";
  
  export const addRaceEventAll = (payload) => ({
    type: ADD_HORSE_RACE_MATCH_ALL,
    payload,
  });
  
  export const addRaceEventAllSuccess = (payload) => ({
    type: ADD_HORSE_RACE_MATCH_ALL_SUCCESS,
    payload,
  });
  
  export const addRaceEventAllFailure = () => ({
    type: ADD_HORSE_RACE_MATCH_ALL_FAILURE,
  });
  