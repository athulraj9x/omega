import { GET_BET_STATUS, GET_BET_STATUS_SUCCESS, GET_BET_STATUS_FAILURE } from "../types";

export const getBetStatus = (payload) => ({
  type: GET_BET_STATUS,
  payload,
});

export const getBetStatusSuccess = (payload) => ({
  type: GET_BET_STATUS_SUCCESS,
  payload,
});

export const getBetStatusFailure = () => ({
  type: GET_BET_STATUS_FAILURE,
});
