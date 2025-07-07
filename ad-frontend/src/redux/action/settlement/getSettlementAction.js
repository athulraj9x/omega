import {
  GET_SETTLEMENT,
  GET_SETTLEMENT_SUCCESS,
  GET_SETTLEMENT_FAILURE,
} from "../types";

export const getSettlement = (payload) => ({
  type: GET_SETTLEMENT,
  payload,
});

export const getSettlementSuccess = (payload) => ({
  type: GET_SETTLEMENT_SUCCESS,
  payload,
});

export const getSettlementFailure = () => ({
  type: GET_SETTLEMENT_FAILURE,
});
