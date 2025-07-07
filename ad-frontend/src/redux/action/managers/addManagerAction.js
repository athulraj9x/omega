import {
  ADD_MANAGER,
  ADD_MANAGER_SUCCESS,
  ADD_MANAGER_FAILURE,
} from "../types";

export const addManager = (payload) => ({
  type: ADD_MANAGER,
  payload,
});

export const addManagerSuccess = (payload) => ({
  type: ADD_MANAGER_SUCCESS,
  payload,
});

export const addManagerFailure = () => ({
  type: ADD_MANAGER_FAILURE,
});
