import {
  BETFAIR_ENGINE,
  BETFAIR_ENGINE_FAILURE,
  BETFAIR_ENGINE_SUCCESS,
} from "../types";

export const getBetFairEngine = (payload) => ({
  type: BETFAIR_ENGINE,
  payload,
});

export const getBetfairEngineSuccess = (payload) => ({
  type: BETFAIR_ENGINE_SUCCESS,
  payload,
});

export const getBetFairEngineFailure = () => ({
  type: BETFAIR_ENGINE_FAILURE,
});
