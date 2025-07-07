import { GLOBAL_CURRENCY_VALUE, GLOBAL_CURRENCY_VALUE_SUCCESS } from "../types";

export const globalCurrencyValue = (payload) => ({
  type: GLOBAL_CURRENCY_VALUE,
  payload,
});

export const globalCurrencyValueSuccess = (payload) => ({
  type: GLOBAL_CURRENCY_VALUE_SUCCESS,
  payload,
});
