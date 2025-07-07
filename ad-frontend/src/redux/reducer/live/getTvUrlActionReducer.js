import {
    GET_TV_URL,
    GET_TV_URL_SUCCESS,
    GET_TV_URL_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    urlData: null,
  };
  
  const getTvUrlReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_TV_URL:
        return { ...state, loading: true };
      case GET_TV_URL_SUCCESS:
        return { ...state, urlData: action.payload, loading: false };
      case GET_TV_URL_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getTvUrlReducer;