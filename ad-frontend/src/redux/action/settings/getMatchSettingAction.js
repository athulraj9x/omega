import {
  GET_MATCH_SETTING,
  GET_MATCH_SETTING_SUCCESS,
  GET_MATCH_SETTING_FAILURE,
} from "../types";

export const getMatchSetting = (payload) => ({
  type: GET_MATCH_SETTING,
  payload,
});

export const getMatchSettingSuccess = (payload) => ({
  type: GET_MATCH_SETTING_SUCCESS,
  payload,
});

export const getMatchSettingFailure = () => ({
  type: GET_MATCH_SETTING_FAILURE,
});
