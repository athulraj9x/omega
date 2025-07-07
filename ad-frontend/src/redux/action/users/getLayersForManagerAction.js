import { GET_LAYERS_FOR_MANAGER, GET_LAYERS_FOR_MANAGER_SUCCESS, GET_LAYERS_FOR_MANAGER_FAILURE } from "../types";

export const getLayersForManager = (payload) => ({
  type: GET_LAYERS_FOR_MANAGER,
  payload,
});

export const getLayersForManagerSuccess = (payload) => ({
  type: GET_LAYERS_FOR_MANAGER_SUCCESS,
  payload,
});

export const getLayersForManagerFailure = () => ({
  type: GET_LAYERS_FOR_MANAGER_FAILURE,
});
