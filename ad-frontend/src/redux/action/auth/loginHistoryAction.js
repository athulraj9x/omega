import { LOGIN_HISTORY, LOGIN_HISTORY_SUCCESS, LOGIN_HISTORY_FAILURE } from "../types";

export const loginHistory = (payload) => ({
  type: LOGIN_HISTORY,
  payload,
});

export const loginHistorySuccess = (payload) => ({
  type: LOGIN_HISTORY_SUCCESS,
  payload,
});

export const loginHistoryFailure = () => ({
  type: LOGIN_HISTORY_FAILURE,
});
