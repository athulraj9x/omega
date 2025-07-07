import {
    VERIFY_TWO_FACTOR_CODE,
    VERIFY_TWO_FACTOR_CODE_SUCCESS,
    VERIFY_TWO_FACTOR_CODE_FAILURE,
  } from "../types";
  
  export const VerifyTwoFactorCodeAction = (payload) => ({
    type: VERIFY_TWO_FACTOR_CODE,
    payload,
  });
  
  export const VerifyTwoFactorCodeActionSuccess = (payload) => ({
    type: VERIFY_TWO_FACTOR_CODE_SUCCESS,
    payload,
  });
  
  export const VerifyTwoFactorCodeActionFailure = () => ({
    type: VERIFY_TWO_FACTOR_CODE_FAILURE,
  });
  