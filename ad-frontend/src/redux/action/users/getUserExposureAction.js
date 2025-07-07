import { GET_USER_EXPOSURE, GET_USER_EXPOSURE_SUCCESS, GET_USER_EXPOSURE_FAILURE } from "../types";

export const getUserExposure = (payload) => ({
  type: GET_USER_EXPOSURE,
  payload,
});

export const getUserExposureSuccess = (payload) => ({
  type: GET_USER_EXPOSURE_SUCCESS,
  payload,
});

export const getUserExposureFailure = () => ({
  type: GET_USER_EXPOSURE_FAILURE,
});





