import {
  WHITELABEL_B2C_HELPLINE_ADD,
  WHITELABEL_B2C_HELPLINE_ADD_SUCCESS,
  WHITELABEL_B2C_HELPLINE_ADD_FAILURE,
} from "../types";

export const addHelpline = (payload) => ({
  type: WHITELABEL_B2C_HELPLINE_ADD,
  payload,
});

export const addHelplineSuccess = (payload) => ({
  type: WHITELABEL_B2C_HELPLINE_ADD_SUCCESS,
  payload,
});

export const addHelplineFailure = () => ({
  type: WHITELABEL_B2C_HELPLINE_ADD_FAILURE,
});
