import {
  GET_DBRUNNERS,
  GET_DBRUNNERS_SUCCESS,
  GET_DBRUNNERS_FAILURE,
} from "../types";

export const getDbRunners = (payload) => ({
  type: GET_DBRUNNERS,
  payload,
});

export const getDbRunnerSuccess = (payload) => ({
  type: GET_DBRUNNERS_SUCCESS,
  payload,
});

export const getDbRunnerFailure = () => ({
  type: GET_DBRUNNERS_FAILURE,
});
