import {
  GET_LEAGUE_SETTING,
  GET_LEAGUE_SETTING_SUCCESS,
  GET_LEAGUE_SETTING_FAILURE,
} from "../types";

export const getLeagueSetting = (payload) => ({
  type: GET_LEAGUE_SETTING,
  payload,
});

export const getLeagueSettingSuccess = (payload) => ({
  type: GET_LEAGUE_SETTING_SUCCESS,
  payload,
});

export const getLeagueSettingFailure = () => ({
  type: GET_LEAGUE_SETTING_FAILURE,
});
