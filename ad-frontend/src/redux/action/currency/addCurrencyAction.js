import {
  ADD_CURRENCY,
  ADD_CURRENCY_SUCCESS,
  ADD_CURRENCY_FAILURE
} from "../types";

export const addCurrency = (payload) => ({
  type: ADD_CURRENCY,
  payload,
});

export const addCurrencySuccess = (payload) => ({
  type: ADD_CURRENCY_SUCCESS,
  payload,
});

export const addCurrencyFailure = () => ({
  type: ADD_CURRENCY_FAILURE,
});