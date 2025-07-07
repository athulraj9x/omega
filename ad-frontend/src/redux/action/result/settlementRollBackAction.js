import {
  SETTLEMENT_ROLLBACK,
  SETTLEMENT_ROLLBACK_SUCCESS,
  SETTLEMENT_ROLLBACK_FAILURE,
} from "../types";

export const settlementRollBack = (payload) => ({
  type: SETTLEMENT_ROLLBACK,
  payload,
});

export const settlementRollBackSuccess = () => ({
  type: SETTLEMENT_ROLLBACK_SUCCESS,
});

export const settlementRollBackFailure = () => ({
  type: SETTLEMENT_ROLLBACK_FAILURE,
});
