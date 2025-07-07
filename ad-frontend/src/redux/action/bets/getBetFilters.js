import {
  GET_BET_FILTER,
  GET_BET_FILTER_SUCCESS,
  GET_BET_FILTER_FAILURE,
} from "../types";

export const getbetFilters = (payload) => ({
  type: GET_BET_FILTER,
  payload,
});

export const getbetFiltersSuccess = (payload) => ({
  type: GET_BET_FILTER_SUCCESS,
  payload,
});

export const getbetFiltersFailure = () => ({
  type: GET_BET_FILTER_FAILURE,
});
