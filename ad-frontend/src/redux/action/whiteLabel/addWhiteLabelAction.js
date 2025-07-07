import {
  ADD_WHITELABEL,
  ADD_WHITELABEL_SUCCESS,
  ADD_WHITELABEL_FAILURE,
} from "../types";

export const addWhiteLabel = (payload) => ({
  type: ADD_WHITELABEL,
  payload,
});

export const addWhiteLabelSuccess = (payload) => ({
  type: ADD_WHITELABEL_SUCCESS,
  payload,
});

export const addWhiteLabelFailure = () => ({
  type: ADD_WHITELABEL_FAILURE,
});
