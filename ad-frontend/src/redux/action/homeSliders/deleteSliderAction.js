import {
  DELETE_SLIDER,
  DELETE_SLIDER_SUCCESS,
  DELETE_SLIDER_FAILURE,
} from "../types";

export const deleteSlider = (payload) => ({
  type: DELETE_SLIDER,
  payload,
});

export const deleteSliderSuccess = (payload) => ({
  type: DELETE_SLIDER_SUCCESS,
  payload,
});

export const deleteSliderFailure = () => ({
  type: DELETE_SLIDER_FAILURE,
});
