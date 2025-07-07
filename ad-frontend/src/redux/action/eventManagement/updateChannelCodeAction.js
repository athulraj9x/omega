import {
  UPDATE_CHANNEL_CODE,
  UPDATE_CHANNEL_CODE_SUCCESS,
  UPDATE_CHANNEL_CODE_FAILURE,
} from "../types";

export const updateChannelCode = (payload) => ({
  type: UPDATE_CHANNEL_CODE,
  payload,
});

export const updateChannelCodeSuccess = (payload) => ({
  type: UPDATE_CHANNEL_CODE_SUCCESS,
  payload,
});

export const updateChannelCodeFailure = () => ({
  type: UPDATE_CHANNEL_CODE_FAILURE,
});
