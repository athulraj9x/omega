
import { LIVEEXPOSURE , LIVEEXPOSURE_SUCCESS , LIVEEXPOSURE_FAIL } from "../types";

export const getLiveExposureData = (payload) => ({
  type: LIVEEXPOSURE,
  payload
});

export const getLiveExposureDataSuccess = (payload) => ({
  type: LIVEEXPOSURE_SUCCESS,
  payload,
});

export const getLiveExposureFailure = () => ({
  type: LIVEEXPOSURE_FAIL,
});
