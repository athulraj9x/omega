import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE } from "../types";

export const login = (payload) => ({
  type: LOGIN,
  payload,
});

export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = () => ({
  type: LOGIN_FAILURE,
});
