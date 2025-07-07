import {
  POST_SPORT_SETTINGS,
  POST_SPORT_SETTINGS_SUCCESS,
  POST_SPORT_SETTINGS_FAILURE,
} from "../types";

export const postSportSetting = (payload) => ({
  type: POST_SPORT_SETTINGS,
  payload,
});

export const postSportSettingSuccess = (payload) => ({
  type: POST_SPORT_SETTINGS_SUCCESS,
  payload,
});

export const postSportSettingFailure = () => ({
  type: POST_SPORT_SETTINGS_FAILURE,
});
