import { UPDATE_BONUS, UPDATE_BONUS_SUCCESS, UPDATE_BONUS_FAILURE } from "../types";

export const updateBonus = (payload) => ({
  type: UPDATE_BONUS,
  payload,
});

export const updateBonusSuccess = (payload) => ({
  type: UPDATE_BONUS_SUCCESS,
  payload,
});

export const updateBonusFailure = () => ({
  type: UPDATE_BONUS_FAILURE,
});
