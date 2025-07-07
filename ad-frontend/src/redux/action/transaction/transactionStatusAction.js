import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_SUCCESS,
  TRANSACTION_STATUS_FAILURE
} from "../types";

export const transactionStatus = (payload) => ({
  type: TRANSACTION_STATUS,
  payload,
});

export const transactionStatusSuccess = () => ({
  type: TRANSACTION_STATUS_SUCCESS,
});

export const transactionStatusFailure = () => ({
  type: TRANSACTION_STATUS_FAILURE,
});
