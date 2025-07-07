import { ERRORBETS, ERRORBETSSUCCESS, ERRORBETSFAILURE } from "../types";

export const getErrorBets = (payload) => ({
  type: ERRORBETS,
  payload,
});

export const getErrorBetsSuccess = (payload) => ({
  type: ERRORBETSSUCCESS,
  payload,
});

export const getAllErrorBetsFailure = () => ({
  type: ERRORBETSFAILURE,
});
