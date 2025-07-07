import { GET_TV_URL, GET_TV_URL_SUCCESS, GET_TV_URL_FAILURE } from "../types";

export const getTvUrl = (payload) => ({
  type: GET_TV_URL,
  payload,
});

export const getTvUrlSuccess = (payload) => ({
  type: GET_TV_URL_SUCCESS,
  payload,
});

export const getTvUrlFailure = () => ({
  type: GET_TV_URL_FAILURE,
})