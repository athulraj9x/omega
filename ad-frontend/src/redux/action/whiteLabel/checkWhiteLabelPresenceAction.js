import {
  CHECK_WHITELABEL_PRESENCE,
  CHECK_WHITELABEL_PRESENCE_SUCCESS,
  CHECK_WHITELABEL_PRESENCE_FAILURE,
} from "../types";

export const checkWhiteLabelPresence = (payload) => ({
  type:CHECK_WHITELABEL_PRESENCE,
  payload,
});

export const checkWhiteLabelPresenceSuccess = (payload) => ({
  type: CHECK_WHITELABEL_PRESENCE_SUCCESS,
});

export const checkWhiteLabelPresenceFailure = () => ({
  type: CHECK_WHITELABEL_PRESENCE_FAILURE,
});