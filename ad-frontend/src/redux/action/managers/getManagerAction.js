import {
  GET_MANAGERS,
  GET_MANAGERS_SUCCESS,
  GET_MANAGERS_FAILURE,
} from "../types";

export const getManager = (payload) => ({
  type: GET_MANAGERS,
  payload,
});

export const getManagerSuccess = (payload) => ({
  type: GET_MANAGERS_SUCCESS,
  payload,
});

export const getManagerFailure = () => ({
  type: GET_MANAGERS_FAILURE,
});
