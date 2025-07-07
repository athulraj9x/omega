import {
  GET_WHITELABEL,
  GET_WHITELABEL_SUCCESS,
  GET_WHITELABEL_FAILURE,
} from "../types";

export const getWhiteLabel = (payload) => ({
  type: GET_WHITELABEL,
  payload,
});

export const getWhiteLabelSuccess = (payload) => ({
  type: GET_WHITELABEL_SUCCESS,
  payload,
});

export const getWhiteLabelFailure = () => ({
  type: GET_WHITELABEL_FAILURE,
});
