import { GET_BANNER, GET_BANNER_SUCCESS, GET_BANNER_FAILURE } from "../types";

export const getBanner = (payload) => ({
  type: GET_BANNER,
  payload,
});

export const getBannerSuccess = (payload) => ({
  type: GET_BANNER_SUCCESS,
  payload,
});

export const getBannerFailure = () => ({
  type: GET_BANNER_FAILURE,
});
