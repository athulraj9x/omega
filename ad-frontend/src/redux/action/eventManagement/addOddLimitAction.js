import {
  ADD_ODDLIMIT,
  ADD_ODDLIMIT_SUCCESS,
  ADD_ODDLIMIT_FAILURE,
} from "../types";

export const addOddLimit = (payload) => ({
  type: ADD_ODDLIMIT,
  payload,
});

export const addOddLimitSuccess = (payload) => ({
  type: ADD_ODDLIMIT_SUCCESS,
  payload,
});

export const addOddLimitFailure = () => ({
  type: ADD_ODDLIMIT_FAILURE,
});
