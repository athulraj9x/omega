import {
  GET_SPORT_SETTINGS,
  GET_SPORT_SETTINGS_SUCCESS,
  GET_SPORT_SETTINGS_FAILURE,
} from "../types";

export const getSportSettings = (payload) => ({
  type: GET_SPORT_SETTINGS,
  payload,
});

export const getSportSettingsSuccess = (payload) => ({
  type: GET_SPORT_SETTINGS_SUCCESS,
  payload,
});

export const getSportSettingsFailure = () => ({
  type: GET_SPORT_SETTINGS_FAILURE,
});
