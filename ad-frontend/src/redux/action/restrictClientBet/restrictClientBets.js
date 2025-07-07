import {
    RESTRICT_LAYERS_BETS,
    RESTRICT_LAYERS_BETS_SUCCESS,
    RESTRICT_LAYERS_BETS_FAILURE,
  } from "../types";
  
  export const restrictClientBets = (payload) => ({
    type: RESTRICT_LAYERS_BETS,
    payload,
  });
  
  export const restrictLayersBetsSuccess = () => ({
    type: RESTRICT_LAYERS_BETS_SUCCESS,
  });
  
  export const restrictLayersBetsFailure = () => ({
    type: RESTRICT_LAYERS_BETS_FAILURE,
  });
  