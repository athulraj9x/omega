import {
  WHITELABEL_B2C_HELPLINE_GET,
  WHITELABEL_B2C_HELPLINE_GET_SUCCESS,
  WHITELABEL_B2C_HELPLINE_GET_FAILURE,
} from "../types";

export const getHelpline = () => ({
  type: WHITELABEL_B2C_HELPLINE_GET,
});

export const getHelplineSuccess = (payload) => ({
  type: WHITELABEL_B2C_HELPLINE_GET_SUCCESS,
  payload,
});

export const getHelplineFailure = () => ({
  type: WHITELABEL_B2C_HELPLINE_GET_FAILURE,
});
