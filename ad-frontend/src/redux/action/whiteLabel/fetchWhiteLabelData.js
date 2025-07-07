import {
  FETCH_WHITELABEL_DATA,
  FETCH_WHITELABEL_DATA_SUCCESS,
  FETCH_WHITELABEL_DATA_FAILURE,
} from "../types";

export const fetchWhiteLabelData = (payload) => ({
  type: FETCH_WHITELABEL_DATA,
  payload,
});

export const fetchWhiteLabelDataSuccess = (payload) => ({
  type: FETCH_WHITELABEL_DATA_SUCCESS,
  payload,
});

export const fetchWhiteLabelDataFailure = () => ({
  type: FETCH_WHITELABEL_DATA_FAILURE,
});
