import { ADD_GROUP_NAME, ADD_GROUP_NAME_SUCCESS, ADD_GROUP_NAME_FAILURE } from "../types";

export const addGroupName = (payload) => ({
  type: ADD_GROUP_NAME,
  payload,
});

export const addGroupNameSuccess = (payload) => ({
  type: ADD_GROUP_NAME_SUCCESS,
  payload,
});

export const addGroupNameFailure = () => ({
  type: ADD_GROUP_NAME_FAILURE,
});
