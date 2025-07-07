import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from "../types";

export const resetPassword = (payload) => ({
  type: RESET_PASSWORD,
  payload,
});

export const resetPasswordSuccess = (payload) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload,
});

export const resetPasswordFailure = () => ({
  type: RESET_PASSWORD_FAILURE,
});
