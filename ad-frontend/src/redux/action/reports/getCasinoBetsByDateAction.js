import {
  GET_CASINO_BETS_BY_DATE,
  GET_CASINO_BETS_BY_DATE_SUCCESS,
  GET_CASINO_BETS_BY_DATE_FAILURE,
} from "../types";

export const getCasinoBetsByDate = (payload) => ({
  type: GET_CASINO_BETS_BY_DATE,
  payload,
});

export const getCasinoBetsByDateSuccess = (payload) => ({
  type: GET_CASINO_BETS_BY_DATE_SUCCESS,
  payload,
});

export const getCasinoBetsByDateFailure = () => ({
  type: GET_CASINO_BETS_BY_DATE_FAILURE,
});
