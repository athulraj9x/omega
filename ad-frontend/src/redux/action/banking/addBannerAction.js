import { ADD_BANK, ADD_BANK_SUCCESS, ADD_BANK_FAILURE } from "../types";

export const addBank = (payload) => ({
  type: ADD_BANK,
  payload,
});

export const addBankSuccess = (payload) => ({
  type: ADD_BANK_SUCCESS,
  payload,
});

export const addBankFailure = () => ({
  type: ADD_BANK_FAILURE,
});
