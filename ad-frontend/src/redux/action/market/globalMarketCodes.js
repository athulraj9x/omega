import { GLOBAL_MARKET_CODES, GLOBAL_MARKET_CODES_SUCCESS } from "../types";

export const globalMaketCode = (payload) => ({
  type: GLOBAL_MARKET_CODES,
  payload,
});

export const globalMaketCodeSuccess = (payload) => ({
  type: GLOBAL_MARKET_CODES_SUCCESS,
  payload,
});
