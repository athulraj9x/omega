import {
   LAYERCURRENCY,
   LAYERCURRENCY_FAILURE,
   LAYERCURRENCY_SUCCESS
  } from "../types";
  
  export const getLayerCurrency = (payload) => ({
    type: LAYERCURRENCY,
    payload,
  });
  
  export const getLayerCurrencySuccess = (payload) => ({
    type: LAYERCURRENCY_SUCCESS,
    payload,
  });
  
  export const getLayerCurrencyFailure = () => ({
    type: LAYERCURRENCY_FAILURE,
  });
  