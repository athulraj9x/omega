import {
    GENERATE_QR_CODE,
    GENERATE_QR_CODE_SUCCESS,
    GENERATE_QR_CODE_FAILURE,
  } from "../types";
  
  export const GenerateQRcode = (payload) => ({
    type: GENERATE_QR_CODE,
    payload,
  });
  
  export const GenerateQRcodeSuccess = (payload) => ({
    type: GENERATE_QR_CODE_SUCCESS,
    payload,
  });
  
  export const GenerateQRcodeFailure = () => ({
    type: GENERATE_QR_CODE_FAILURE,
  });
  