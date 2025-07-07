import {
  POST_LEAGUE_SETTING,
  POST_LEAGUE_SETTING_SUCCESS,
  POST_LEAGUE_SETTING_FAILURE,
} from "../types";

export const postLeagueSetting = (payload) => ({
  type: POST_LEAGUE_SETTING,
  payload,
});

export const postLeagueSettingSuccess = (payload) => ({
  type: POST_LEAGUE_SETTING_SUCCESS,
  payload,
});

export const postLeagueSettingFailure = () => ({
  type: POST_LEAGUE_SETTING_FAILURE,
});
