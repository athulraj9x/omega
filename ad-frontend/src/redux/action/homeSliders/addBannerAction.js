import { ADD_BANNER, ADD_BANNER_SUCCESS, ADD_BANNER_FAILURE } from "../types";

export const addBanner = (payload) => ({
  type: ADD_BANNER,
  payload,
});

export const addBannerSuccess = (payload) => ({
  type: ADD_BANNER_SUCCESS,
  payload,
});

export const addBannerFailure = () => ({
  type: ADD_BANNER_FAILURE,
});
