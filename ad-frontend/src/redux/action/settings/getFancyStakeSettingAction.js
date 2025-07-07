import {
  GET_FANCY_STAKE_LIMIT,
  GET_FANCY_STAKE_LIMIT_SUCCESS,
  GET_FANCY_STAKE_LIMIT_FAILURE,
} from "../types";

export const getFancyStakeLimit = (payload) => ({
  type: GET_FANCY_STAKE_LIMIT,
  payload,
});

export const getFancyStakeLimitSuccess = (payload) => ({
  type: GET_FANCY_STAKE_LIMIT_SUCCESS,
  payload,
});

export const getFancyStakeLimitFailure = () => ({
  type: GET_FANCY_STAKE_LIMIT_FAILURE,
});
