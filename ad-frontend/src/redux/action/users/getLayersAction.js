import { GET_LAYERS, GET_LAYERS_SUCCESS, GET_LAYERS_FAILURE } from "../types";

export const getLayers = (payload) => ({
  type: GET_LAYERS,
  payload,
});

export const getLayersSuccess = (payload) => ({
  type: GET_LAYERS_SUCCESS,
  payload,
});

export const getLayersFailure = () => ({
  type: GET_LAYERS_FAILURE,
});
