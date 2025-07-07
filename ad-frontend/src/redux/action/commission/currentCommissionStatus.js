//this is for fetching Events from external Api

import {
    COMMISSION_CURRENT_VALUE
  } from "../types";
  
  export const currentCommissionStatus = (payload) => ({
    type: COMMISSION_CURRENT_VALUE,
    payload,
  });
  
//   export const setCommissionValueSuccess = (payload) => ({
//     type: SET_COMMISSION_VALUE_SUCCESS,
//     payload,
//   });
  
//   export const setCommissionValueFailure = () => ({
//     type: SET_COMMISSION_VALUE_FAILURE,
//   });
  