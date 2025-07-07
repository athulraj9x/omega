import {  
  GET_BANK,
  GET_BANK_SUCCESS,
  GET_BANK_FAILURE,
 } from "../types";

export const getBank = (payload) => ({
  type: GET_BANK,
  payload,
});

export const getBankSuccess = (payload) => ({
  type: GET_BANK_SUCCESS,
  payload,
});

export const getBankFailure = () => ({
  type: GET_BANK_FAILURE,
});
