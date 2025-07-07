import {
    GOOGLE_AUTHENTICATOR_OTP_VALIDATION,
    GOOGLE_AUTHENTICATOR_OTP_VALIDATION_SUCCESS,
    GOOGLE_AUTHENTICATOR_OTP_VALIDATION_FAILURE,
  } from "../types";
  
  export const googleAuthenticatorOTPValidation = (payload) => ({
    type: GOOGLE_AUTHENTICATOR_OTP_VALIDATION,
    payload,
  });
  
  export const googleAuthenticatorOTPValidationSuccess = (payload) => ({
    type: GOOGLE_AUTHENTICATOR_OTP_VALIDATION_SUCCESS,
    payload,
  });
  
  export const googleAuthenticatorOTPValidationFailure = () => ({
    type: GOOGLE_AUTHENTICATOR_OTP_VALIDATION_FAILURE,
  });
  