import {
    UPDATE_TWO_FACTOR_STATUS,
    UPDATE_TWO_FACTOR_STATUS_SUCCESS,
    UPDATE_TWO_FACTOR_STATUS_FAILURE,
  } from "../types";
  
  export const updateTwoFactorStatusAction = (payload) => ({
    type: UPDATE_TWO_FACTOR_STATUS,
    payload,
  });
  
  export const updateTwoFactorStatusActionSuccess = (payload) => ({
    type: UPDATE_TWO_FACTOR_STATUS_SUCCESS,
    payload,
  });
  
  export const updateTwoFactorStatusActionFailure = () => ({
    type: UPDATE_TWO_FACTOR_STATUS_FAILURE,
  });
  