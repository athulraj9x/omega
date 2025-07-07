import { ADD_WITHDRAWAL, ADD_WITHDRAWAL_SUCCESS, ADD_WITHDRAWAL_FAILURE } from "../types";

export const addWithdrawal = (payload) => ({
  type: ADD_WITHDRAWAL,
  payload,
});

export const addWithdrawalSuccess = () => ({
  type: ADD_WITHDRAWAL_SUCCESS,
});

export const addWithdrawalFailure = () => ({
  type: ADD_WITHDRAWAL_FAILURE,
});
