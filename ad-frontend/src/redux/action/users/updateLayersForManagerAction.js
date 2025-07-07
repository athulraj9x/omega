import {
  UPDATE_LAYERS_FOR_MANAGER,
  UPDATE_LAYERS_FOR_MANAGER_SUCCESS,
  UPDATE_LAYERS_FOR_MANAGER_FAILURE,
} from "../types";

export const updateLayersForManager = (payload) => ({
  type: UPDATE_LAYERS_FOR_MANAGER,
  payload,
});

export const updateLayersForManagerSuccess = (payload) => ({
  type: UPDATE_LAYERS_FOR_MANAGER_SUCCESS,
  payload,
});

export const updateLayersForManagerFailure = () => ({
  type: UPDATE_LAYERS_FOR_MANAGER_FAILURE,
});
