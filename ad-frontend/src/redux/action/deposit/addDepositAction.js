import { ADD_DEPOSIT, ADD_DEPOSIT_SUCCESS, ADD_DEPOSIT_FAILURE } from "../types";

export const postDeposit = (payload) => ({
  type: ADD_DEPOSIT,
  payload,
});

export const addDepositSuccess = () => ({
  type: ADD_DEPOSIT_SUCCESS,
});

export const addDepositFailure = () => ({
  type: ADD_DEPOSIT_FAILURE,
});
