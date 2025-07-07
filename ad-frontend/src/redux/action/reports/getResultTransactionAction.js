import {
  GET_RESULT_TRANSACTION,
  GET_RESULT_TRANSACTION_SUCCESS,
  GET_RESULT_TRANSACTION_FAILURE,
} from "../types";

export const getResultTransation = (payload) => ({
  type: GET_RESULT_TRANSACTION,
  payload,
});

export const getResultTransationSuccess = (payload) => ({
  type: GET_RESULT_TRANSACTION_SUCCESS,
  payload,
});

export const getResultTransationFailure = () => ({
  type: GET_RESULT_TRANSACTION_FAILURE,
});
