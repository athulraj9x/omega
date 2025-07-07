import {
  GET_ALLBETS,
  GET_ALLBETS_SUCCESS,
  GET_ALLBETS_FAILURE,
} from "../types";

export const getAllBets = (payload) => ({
  type: GET_ALLBETS,
  payload,
});

export const getAllBetsSuccess = (payload) => ({
  type: GET_ALLBETS_SUCCESS,
  payload,
});

export const getAllBetsFailure = () => ({
  type: GET_ALLBETS_FAILURE,
});
