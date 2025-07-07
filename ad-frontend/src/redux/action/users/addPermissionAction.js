import { ADD_PERMISSION, ADD_PERMISSION_SUCCESS, ADD_PERMISSION_FAILURE } from "../types";

export const addPermission = (payload) => ({
  type: ADD_PERMISSION,
  payload,
});

export const addPermissionSuccess = (payload) => ({
  type: ADD_PERMISSION_SUCCESS,
  payload,
});

export const addPermissionFailure = () => ({
  type: ADD_PERMISSION_FAILURE,
});
