import { CLIENT_2FA_DETAILS, CLIENT_2FA_DETAILS_SUCCESS, CLIENT_2FA_DETAILS_FAILURE } from "../types";

export const client2FADetails = (payload) => ({
  type: CLIENT_2FA_DETAILS,
  payload,
});

export const client2FADetailsSuccess = (payload) => ({
  type: CLIENT_2FA_DETAILS_SUCCESS,
  payload,
});

export const client2FADetailsFailure = () => ({
  type: CLIENT_2FA_DETAILS_FAILURE,
});





