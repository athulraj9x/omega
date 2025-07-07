import { LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE } from "../types";

export const logout = (payload) => ({
  type: LOGOUT,
  payload,
});

export const logoutSuccess = (payload) => ({
  type: LOGOUT_SUCCESS,
  payload,
});

export const logoutFailure = () => ({
  type: LOGOUT_FAILURE,
});
