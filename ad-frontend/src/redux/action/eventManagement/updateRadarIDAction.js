import {
    UPDATE_RADAR_ID,
    UPDATE_RADAR_ID_SUCCESS,
    UPDATE_RADAR_ID_FAILURE,
  } from "../types";
  
  export const updateRadarId = (payload) => ({
    type: UPDATE_RADAR_ID,
    payload,
  });
  
  export const updateRadarIdSuccess = (payload) => ({
    type: UPDATE_RADAR_ID_SUCCESS,
    payload,
  });
  
  export const updateRadarIdFailure = () => ({
    type: UPDATE_RADAR_ID_FAILURE,
  });