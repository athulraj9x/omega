import {
    GOOGLE_LOGIN_VALIDATION,
    GOOGLE_LOGIN_VALIDATION_SUCCESS,
    GOOGLE_LOGIN_VALIDATION_FAILURE,
  } from "../types";
  
  export const googleloginValidation = (payload) => ({
    type: GOOGLE_LOGIN_VALIDATION,
    payload,
  });
  
  export const googleloginValidationSuccess = (payload) => ({
    type: GOOGLE_LOGIN_VALIDATION_SUCCESS,
    payload,
  });
  
  export const googleloginValidationFailure = () => ({
    type: GOOGLE_LOGIN_VALIDATION_FAILURE,
  });
  