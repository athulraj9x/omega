//this is for fetching Runners from external Api

import {
  GET_RUNNERS,
  GET_RUNNERS_SUCCESS,
  GET_RUNNERS_FAILURE,
} from "../types";

export const getRunners = (payload) => ({
  type: GET_RUNNERS,
  payload,
});

export const getRunnerSuccess = (payload) => ({
  type: GET_RUNNERS_SUCCESS,
  payload,
});

export const getRunnerFailure = () => ({
  type: GET_RUNNERS_FAILURE,
});
