import {
  GET_BETS_AND_BOOKS,
  GET_BETS_AND_BOOKS_SUCCESS,
  GET_BETS_AND_BOOKS_FAILURE,
} from "../types";

export const getBetsAndBooks = (payload) => ({
  type: GET_BETS_AND_BOOKS,
  payload,
});

export const getBetsAndBooksSuccess = (payload) => ({
  type: GET_BETS_AND_BOOKS_SUCCESS,
  payload,
});

export const getBetsAndBooksFailure = () => ({
  type: GET_BETS_AND_BOOKS_FAILURE,
});
