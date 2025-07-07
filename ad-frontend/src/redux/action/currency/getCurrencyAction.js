import {
  GET_CURRENCY,
  GET_CURRENCY_SUCCESS,
  GET_CURRENCY_FAILURE,
  UPDATE_CURRENCY_REQUEST,
  UPDATE_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_FAILURE,
} from "../types";

export const getCurrency = (payload) => ({
  type: GET_CURRENCY,
  payload,
});

export const getCurrencySuccess = (payload) => ({
  type: GET_CURRENCY_SUCCESS,
  payload,
});

export const getCurrencyFailure = () => ({
  type: GET_CURRENCY_FAILURE,
});

export const updateCurrencyRequest = (payload) => ({
  type: UPDATE_CURRENCY_REQUEST,
  payload
});

export const updateCurrencySuccess = (payload) => ({
  type: UPDATE_CURRENCY_SUCCESS,
  payload
});

export const updateCurrencyFailure = (error) => ({
  type: UPDATE_CURRENCY_FAILURE
});
