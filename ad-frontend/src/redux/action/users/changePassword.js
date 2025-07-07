import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
} from "../types";

export const changePassword = (payload) => ({
  type: CHANGE_PASSWORD,
  payload,
});

export const changePasswordSuccess = (payload) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload,
});

export const changePasswordFailure = () => ({
  type: CHANGE_PASSWORD_FAILURE,
});
