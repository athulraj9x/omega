import {
    UPDATE_RADAR_ID,
    UPDATE_RADAR_ID_SUCCESS,
    UPDATE_RADAR_ID_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const updateRadarIdReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case UPDATE_RADAR_ID:
        return { ...state, loading: true };
      case UPDATE_RADAR_ID_SUCCESS:
        return { ...state, loading: false };
      case UPDATE_RADAR_ID_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default updateRadarIdReducer;