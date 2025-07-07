
import {
    TWO_FACTOR_TOGGLE_SETTING,
    TWO_FACTOR_TOGGLE_SETTING_SUCCESS,
    TWO_FACTOR_TOGGLE_SETTING_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const twoFactorToggleSettings = (state = INIT_STATE, action) => {
    switch (action.type) {
      case TWO_FACTOR_TOGGLE_SETTING:
        return { ...state, loading: true };
      case TWO_FACTOR_TOGGLE_SETTING_SUCCESS:
        return { ...state, loading: false };
      case TWO_FACTOR_TOGGLE_SETTING_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default twoFactorToggleSettings;
  