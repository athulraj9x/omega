import { GET_USER_BALANCE, GET_USER_BALANCE_SUCCESS, GET_USER_BALANCE_FAILURE } from "../types";

export const getUserBalance = (payload) => ({
  type: GET_USER_BALANCE,
  payload,
});

export const getUserBalanceSuccess = (payload) => ({
  type: GET_USER_BALANCE_SUCCESS,
  payload,
});

export const getUserBalanceFailure = () => ({
  type: GET_USER_BALANCE_FAILURE,
});
