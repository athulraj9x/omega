import {
  DEPOSIT_LIST_FILTER,
  DEPOSIT_LIST_FILTER_SUCCESS,
  DEPOSIT_LIST_FILTER_FAILURE,
} from "../types";

export const depositListFilterAction = (payload) => ({
  type: DEPOSIT_LIST_FILTER,
  payload,
});

export const depositListFilterActionSuccess = () => ({
  type: DEPOSIT_LIST_FILTER_SUCCESS,
});

export const depositListFilterActionFailure = () => ({
  type: DEPOSIT_LIST_FILTER_FAILURE,
});
