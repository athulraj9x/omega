import {
  TWO_AUTHENTICATION,
  TWO_AUTHENTICATION_SUCCESS,
  TWO_AUTHENTICATION_FAILURE,
} from "../types";

export const twoAuthentication = (payload) => ({
  type: TWO_AUTHENTICATION,
  payload,
});

export const twoAuthenticationSuccess = (payload) => ({
  type: TWO_AUTHENTICATION_SUCCESS,
  payload,
});

export const twoAuthenticationFailure = () => ({
  type: TWO_AUTHENTICATION_FAILURE,
});
