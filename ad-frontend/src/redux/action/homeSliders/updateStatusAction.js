import {
  UPDATE_SLIDER,
  UPDATE_SLIDER_SUCCESS,
  UPDATE_SLIDER_FAILURE,
} from "../types";

export const updateSlider = (payload) => ({
  type: UPDATE_SLIDER,
  payload,
});

export const updateSliderSuccess = (payload) => ({
  type: UPDATE_SLIDER_SUCCESS,
  payload,
});

export const updateSliderFailure = () => ({
  type: UPDATE_SLIDER_FAILURE,
});
