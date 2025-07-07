import {
  EVENT_DEACTIVATED,
  EVENT_DEACTIVATED_SUCCESS,
  EVENT_DEACTIVATED_FAILURE,
} from "../types";

export const eventDeActivate = (payload) => ({
  type: EVENT_DEACTIVATED,
  payload,
});

export const eventDeActivateSuccess = () => ({
  type: EVENT_DEACTIVATED_SUCCESS,
});

export const eventDeActivateFailure = () => ({
  type: EVENT_DEACTIVATED_FAILURE,
});
