import { AUTH_DETAIL, AUTH_DETAIL_SUCCESS, AUTH_DETAIL_FAILURE } from "../types";

export const authDetail = (payload) => ({
  type: AUTH_DETAIL,
  payload,
});

export const authDetailSuccess = (payload) => ({
  type: AUTH_DETAIL_SUCCESS,
  payload,
});

export const authDetailFailure = () => ({
  type: AUTH_DETAIL_FAILURE,
});
