import {
  GET_RESULT_TRANSACTION_DETAILS,
  GET_RESULT_TRANSACTION_DETAILS_SUCCESS,
  GET_RESULT_TRANSACTION_DETAILS_FAILURE,
} from "../types";

export const getResultTransationDetail = (payload) => ({
  type: GET_RESULT_TRANSACTION_DETAILS,
  payload,
});

export const getResultTransationDetailSuccess = (payload) => ({
  type: GET_RESULT_TRANSACTION_DETAILS_SUCCESS,
  payload,
});

export const getResultTransationDetailFailure = () => ({
  type: GET_RESULT_TRANSACTION_DETAILS_FAILURE,
});
