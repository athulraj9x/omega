import { GET_INACTIVE_LAYERS, GET_INACTIVE_LAYERS_SUCCESS, GET_INACTIVE_LAYERS_FAILURE } from "../types";

export const getInactiveLayers = (payload) => ({
  type: GET_INACTIVE_LAYERS,
  payload,
});

export const getInactiveLayersSuccess = (payload) => ({
  type: GET_INACTIVE_LAYERS_SUCCESS,
  payload,
});

export const getInactiveLayersFailure = () => ({
  type: GET_INACTIVE_LAYERS_FAILURE,
});
