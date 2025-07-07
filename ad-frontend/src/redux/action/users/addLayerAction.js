import { ADD_LAYERS, ADD_LAYERS_SUCCESS, ADD_LAYERS_FAILURE } from "../types";

export const addLayer = (payload) => ({
  type: ADD_LAYERS,
  payload,
});

export const addLayerSuccess = (payload) => ({
  type: ADD_LAYERS_SUCCESS,
  payload,
});

export const addLayerFailure = () => ({
  type: ADD_LAYERS_FAILURE,
});
