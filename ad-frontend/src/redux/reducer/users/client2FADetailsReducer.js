
import {
    CLIENT_2FA_DETAILS,
    CLIENT_2FA_DETAILS_SUCCESS,
    CLIENT_2FA_DETAILS_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const client2FADetailsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case CLIENT_2FA_DETAILS:
        return { ...state, loading: true };
      case CLIENT_2FA_DETAILS_SUCCESS:
        return { ...state, loading: false };
      case CLIENT_2FA_DETAILS_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default client2FADetailsReducer;
  