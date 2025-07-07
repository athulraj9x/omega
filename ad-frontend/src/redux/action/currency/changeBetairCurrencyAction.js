import {
  CHANGE_BETFAIR_CURRENCY,
  CHANGE_BETFAIR_CURRENCY_SUCCESS,
  CHANGE_BETFAIR_CURRENCY_FAILURE,
} from "../types";

export const changeBetfairCurrency = (payload) => ({
  type: CHANGE_BETFAIR_CURRENCY,
  payload,
});

export const changeBetfairCurrencySuccess = (payload) => ({
  type: CHANGE_BETFAIR_CURRENCY_SUCCESS,
  payload,
});

export const changeBetfairCurrencyFailure = () => ({
  type: CHANGE_BETFAIR_CURRENCY_FAILURE,
});
