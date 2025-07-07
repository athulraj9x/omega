import { GET_RESULT, GET_RESULT_SUCCESS, GET_RESULT_FAILURE } from "../types";

export const getResult = (payload) => ({
  type: GET_RESULT,
  payload,
});

export const getResultSuccess = (payload) => ({
  type: GET_RESULT_SUCCESS,
  payload,
});

export const getResultFailure = () => ({
  type: GET_RESULT_FAILURE,
});
