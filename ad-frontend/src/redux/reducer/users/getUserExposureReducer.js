import {
    GET_USER_EXPOSURE,
    GET_USER_EXPOSURE_SUCCESS,
    GET_USER_EXPOSURE_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    getUserExposureData: null,
  };
  
  const getUserExposureReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_USER_EXPOSURE:
        return { ...state, loading: true };
      case GET_USER_EXPOSURE_SUCCESS:
        return { ...state, getUserExposureData: action.payload, loading: false };
      case GET_USER_EXPOSURE_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getUserExposureReducer;
  