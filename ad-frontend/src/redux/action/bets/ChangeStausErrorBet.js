import {
  CHANGE_ERROR_BETS,
  CHANGE_ERROR_BETS_SUCCESS,
  CHANGE_ERROR_BETS_FAILURE,
} from "../types";

export const changeStatusErrorBet = (payload) => ({
  type: CHANGE_ERROR_BETS,
  payload,
});

export const ChangeStatusErrorBetSuccess = (payload) => ({
  type: CHANGE_ERROR_BETS_SUCCESS,
  payload,
});

export const ChangeStatusErrorBetFailure = () => ({
  type: CHANGE_ERROR_BETS_FAILURE,
});
