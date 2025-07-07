import {
  SETTLEMENT,
  SETTLEMENT_SUCCESS,
  SETTLEMENT_FAILURE,
} from "../types";

export const settlement = (payload) => ({
  type: SETTLEMENT,
  payload,
});

export const settlementSuccess = (payload) => ({
  type: SETTLEMENT_SUCCESS,
  payload,
});

export const settlementFailure = () => ({
  type: SETTLEMENT_FAILURE,
});
