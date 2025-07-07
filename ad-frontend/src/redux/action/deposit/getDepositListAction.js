import { GET_DEPOSITLIST, GET_DEPOSITLIST_SUCCESS, GET_DEPOSITLIST_FAILURE } from "../types";

export const getDepositList = (payload) => ({
  type: GET_DEPOSITLIST,
  payload,
});

export const getDepositListSuccess = () => ({
  type: GET_DEPOSITLIST_SUCCESS,
});

export const getDepositListFailure = () => ({
  type: GET_DEPOSITLIST_FAILURE,
});
