import { ADD_RESULT, ADD_RESULT_SUCCESS, ADD_RESULT_FAILURE } from "../types";

export const addResult = (payload) => ({
  type: ADD_RESULT,
  payload,
});

export const addResultSuccess = () => ({
  type: ADD_RESULT_SUCCESS,
});

export const addResultFailure = () => ({
  type: ADD_RESULT_FAILURE,
});
