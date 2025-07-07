import {
    UPDATE_FANCY_STAKE_LIMIT,
    UPDATE_FANCY_STAKE_LIMIT_SUCCESS,
    UPDATE_FANCY_STAKE_LIMIT_FAILURE,
  } from "../types";

  export const updateFancyStakeLimit =(payload)=>({
    type : UPDATE_FANCY_STAKE_LIMIT,
    payload
  });
  
  export const updateFancyStakeLimitSuccess =(payload)=>({
    type :  UPDATE_FANCY_STAKE_LIMIT_SUCCESS,
    payload
  });

  export const updateFancyStakeLimitFailure =()=>({
    type : UPDATE_FANCY_STAKE_LIMIT_FAILURE
  })