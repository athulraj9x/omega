import {
  ROLLBACK,
  ROLLBACK_SUCCESS,
  ROLLBACK_FAILURE,
} from "../types";

export const rollBack = (payload) => ({
  type: ROLLBACK,
  payload,
});

export const rollBackSuccess = () => ({
  type: ROLLBACK_SUCCESS,
});

export const rollBackFailure = () => ({
  type: ROLLBACK_FAILURE,
});
