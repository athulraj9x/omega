import {
  UPDATE_CLIENT_SHARES,
  UPDATE_CLIENT_SHARES_SUCCESS,
  UPDATE_CLIENT_SHARES_FAILURE,
} from "../types";

export const updateClientShare = (payload) => ({
  type: UPDATE_CLIENT_SHARES,
  payload,
});

export const updateClientShareSuccess = (payload) => ({
  type: UPDATE_CLIENT_SHARES_SUCCESS,
  payload,
});

export const updateClientShareFailure = () => ({
  type: UPDATE_CLIENT_SHARES_FAILURE,
});
