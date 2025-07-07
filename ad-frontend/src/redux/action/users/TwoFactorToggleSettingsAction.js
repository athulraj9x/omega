import {
  TWO_FACTOR_TOGGLE_SETTING,
  TWO_FACTOR_TOGGLE_SETTING_SUCCESS,
  TWO_FACTOR_TOGGLE_SETTING_FAILURE,
} from "../types";

export const twoFactorToggleSettings = (payload) => ({
  type: TWO_FACTOR_TOGGLE_SETTING,
  payload,
});

export const twoFactorToggleSettingsSuccess = (payload) => ({
  type: TWO_FACTOR_TOGGLE_SETTING_SUCCESS,
  payload,
});

export const twoFactorToggleSettingsFailure = () => ({
  type: TWO_FACTOR_TOGGLE_SETTING_FAILURE,
});
