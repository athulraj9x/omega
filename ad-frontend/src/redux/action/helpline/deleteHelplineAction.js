import {
  WHITELABEL_B2C_HELPLINE_DELETE,
  WHITELABEL_B2C_HELPLINE_DELETE_SUCCESS,
  WHITELABEL_B2C_HELPLINE_DELETE_FAILURE,
} from "../types";

export const deleteHelpline = (payload) => ({
  type: WHITELABEL_B2C_HELPLINE_DELETE,
  payload,
});

export const deleteHelplineSuccess = (payload) => ({
  type: WHITELABEL_B2C_HELPLINE_DELETE_SUCCESS,
  payload,
});

export const deleteHelplineFailure = () => ({
  type: WHITELABEL_B2C_HELPLINE_DELETE_FAILURE,
});