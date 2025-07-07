import { GET_EVENT_BASED_BETS, GET_EVENT_BASED_BETS_SUCCESS, GET_EVENT_BASED_BETS_FAILURE } from "../types";

export const getEventBasedBets = (payload) => ({
  type: GET_EVENT_BASED_BETS,
  payload,
});

export const getEventBasedBetsSuccess = (payload) => ({
  type: GET_EVENT_BASED_BETS_SUCCESS,
  payload,
});

export const getEventBasedBetsFailure = () => ({
  type: GET_EVENT_BASED_BETS_FAILURE,
});
