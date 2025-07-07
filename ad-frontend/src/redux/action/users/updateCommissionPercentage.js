import {
  UPDATE_COMMISSION_PERCENTAGE,
  UPDATE_COMMISSION_PERCENTAGE_SUCCESS,
  UPDATE_COMMISSION_PERCENTAGE_FAILURE,
} from "../types";

export const updateCommissionPercentage = (payload) => ({
  type: UPDATE_COMMISSION_PERCENTAGE,
  payload,
});

export const updateCommissionPercentageSuccess = (payload) => ({
  type: UPDATE_COMMISSION_PERCENTAGE_SUCCESS,
  payload,
});

export const updateCommissionPercentageFailure = () => ({
  type: UPDATE_COMMISSION_PERCENTAGE_FAILURE,
});
