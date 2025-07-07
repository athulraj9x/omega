import {
  GET_DELETED_BETS,
  GET_DELETED_BETS_SUCCESS,
  GET_DELETED_BETS_FAILURE,
} from "../types";

export const getDeletedBet = (payload) => ({
  type: GET_DELETED_BETS,
  payload,
});

export const getDeletedBetSuccess = (payload) => ({
  type: GET_DELETED_BETS_SUCCESS,
  payload,
});

export const getDeletedBetFailure = () => ({
  type: GET_DELETED_BETS_FAILURE,
});
