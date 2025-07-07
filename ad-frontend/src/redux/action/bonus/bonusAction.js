import {
  BONUS,
  BONUS_SUCCESS,
  BONUS_FAILURE,
  GET_BONUS,
  GET_BONUS_SUCCESS,
  GET_BONUS_FAILURE
} from "../types";

export const userBonus = (payload) => ({
  type: BONUS,
  payload,
});

export const bonusSuccess = (payload) => ({
  type: BONUS_SUCCESS,
  payload,
});

export const bonusFailure = () => ({
  type: BONUS_FAILURE,
});

export const getBonus = () => ({
  type: GET_BONUS,
});

export const getBonusSuccess = (payload) => ({
  type: GET_BONUS_SUCCESS,
  payload,
});

export const getBonusFailure = () => ({
  type: GET_BONUS_FAILURE,
});