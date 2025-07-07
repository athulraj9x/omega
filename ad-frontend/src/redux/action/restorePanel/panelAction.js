import { ADD_PANEL, ADD_PANEL_SUCCESS, ADD_PANEL_FAILURE } from "../types";

export const addPanel = (payload) => ({
  type: ADD_PANEL,
  payload,
});

export const addPanelSuccess = (payload) => ({
  type: ADD_PANEL_SUCCESS,
  payload,
});

export const addPanelFailure = () => ({
  type: ADD_PANEL_FAILURE,
});
