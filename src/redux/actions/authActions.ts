import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LoginPayload } from "../types/authTypes";

export const loginRequest = (payload: LoginPayload) => ({
  type: LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (user: any) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});
