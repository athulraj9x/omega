import {
  POST_MATCH_SETTING,
  POST_MATCH_SETTING_SUCCESS,
  POST_MATCH_SETTING_FAILURE,
} from "../types";

export const postMatchSetting = (payload) => ({
  type: POST_MATCH_SETTING,
  payload,
});

export const postMatchSettingSuccess = (payload) => ({
  type: POST_MATCH_SETTING_SUCCESS,
  payload,
});

export const postMatchSettingFailure = () => ({
  type: POST_MATCH_SETTING_FAILURE,
});
