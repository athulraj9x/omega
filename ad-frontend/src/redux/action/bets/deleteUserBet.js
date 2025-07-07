import {
  DELETE_USERBET,
  DELETE_USERBET_SUCCESS,
  DELETE_USERBET_FAILURE,
} from "../types";

export const deleteUserBet = (payload) => ({
  type: DELETE_USERBET,
  payload,
});

export const deleteUserBetSuccess = (payload) => ({
  type: DELETE_USERBET_SUCCESS,
  payload,
});

export const deleteUserBetFailure = () => ({
  type: DELETE_USERBET_FAILURE,
});
