import {
  GET_CASINO_TRANSACTION,
  GET_CASINO_TRANSACTION_SUCCESS,
  GET_CASINO_TRANSACTION_FAILURE,
} from "../types";

export const getCasinoTransation = (payload) => ({
  type: GET_CASINO_TRANSACTION,
  payload,
});

export const getCasinoTransationSuccess = (payload) => ({
  type: GET_CASINO_TRANSACTION_SUCCESS,
  payload,
});

export const getCasinoTransationFailure = () => ({
  type: GET_CASINO_TRANSACTION_FAILURE,
});
