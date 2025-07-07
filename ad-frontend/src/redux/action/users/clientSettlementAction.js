import {
  CLIENT_SETTLEMENT,
  CLIENT_SETTLEMENT_SUCCESS,
  CLIENT_SETTLEMENT_FAILURE,
} from "../types";

export const clientSettlement = (payload) => ({
  type: CLIENT_SETTLEMENT,
  payload,
});

export const clientSettlementSuccess = (payload) => ({
  type: CLIENT_SETTLEMENT_SUCCESS,
  payload,
});

export const clientSettlementFailure = () => ({
  type: CLIENT_SETTLEMENT_FAILURE,
});
