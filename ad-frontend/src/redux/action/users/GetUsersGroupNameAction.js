import { GET_USERS_GROUPS, GET_USERS_GROUPS_FAILURE, GET_USERS_GROUPS_SUCCESS } from "../types";

export const getUsersGroupFunctions = (payload) => ({
  type: GET_USERS_GROUPS,
  payload,
});

export const getUsersGroupFunctionsSuccess = (payload) => ({
  type: GET_USERS_GROUPS_SUCCESS,
  payload,
});

export const getUsersGroupFunctionsFailure = () => ({
  type: GET_USERS_GROUPS_FAILURE,
});
