import {
  UPDATE_SETTING,
  UPDATE_SETTING_SUCCESS,
  UPDATE_SETTING_FAILURE,
} from "../types";

export const updateSetting = (payload) => ({
  type: UPDATE_SETTING,
  payload,
});

export const updateSettingSuccess = (payload) => ({
  type: UPDATE_SETTING_SUCCESS,
  payload,
});

export const updateSettingFailure = () => ({
  type: UPDATE_SETTING_FAILURE,
});
