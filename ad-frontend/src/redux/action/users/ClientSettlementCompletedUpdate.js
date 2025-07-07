import { CLIENT_SETTLEMENT_COMPLETED_UPDATION, CLIENT_SETTLEMENT_COMPLETED_UPDATION_FAILURE, CLIENT_SETTLEMENT_COMPLETED_UPDATION_SUCCESS } from "../types";

export const clientSettilementCompleteUpdation = (payload) => ({
  type: CLIENT_SETTLEMENT_COMPLETED_UPDATION,
  payload,
});

export const clientSettilementCompleteUpdationSuccess = (payload) => ({
  type: CLIENT_SETTLEMENT_COMPLETED_UPDATION_SUCCESS,
  payload,
});

export const clientSettilementCompleteUpdationFailure = () => ({
  type: CLIENT_SETTLEMENT_COMPLETED_UPDATION_FAILURE,
});
