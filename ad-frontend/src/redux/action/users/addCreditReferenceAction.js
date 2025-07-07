import { ADD_CREDIT_REFERENCE, ADD_CREDIT_REFERENCE_SUCCESS, ADD_CREDIT_REFERENCE_FAILURE } from "../types";

export const addCreditReference = (payload) => ({
  type: ADD_CREDIT_REFERENCE,
  payload,
});

export const addCreditReferenceSuccess = (payload) => ({
  type: ADD_CREDIT_REFERENCE_SUCCESS,
  payload,
});

export const addCreditReferenceFailure = () => ({
  type: ADD_CREDIT_REFERENCE_FAILURE,
});
