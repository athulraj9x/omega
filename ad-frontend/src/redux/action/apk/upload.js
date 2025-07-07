import {
    UPLOAD_APK,
    UPLOAD_APK_SUCCESS,
    UPLOAD_APK_FAILURE,
  } from "../types";
  
  export const upload_apk = (payload) => ({
    type: UPLOAD_APK,
    payload,
  });
  
  export const upload_apk_Success = (payload) => ({
    type: UPLOAD_APK_SUCCESS,
    payload,
  });
  
  export const upload_apk_Failure = () => ({
    type: UPLOAD_APK_FAILURE,
  });
  