import {
    GET_ACTIVE_FANCIES,
    GET_ACTIVE_FANCIES_SUCCESS,
    GET_ACTIVE_FANCIES_FAILURE,
  } from "../types";
  
  export const getActiveFancies = (payload) => ({
    type: GET_ACTIVE_FANCIES,
    payload,
  });
  
  export const getActiveFanciesSuccess = (payload) => ({
    type: GET_ACTIVE_FANCIES_SUCCESS,
    payload,
  });
  
  export const getActiveFanciesFailure = () => ({
    type: GET_ACTIVE_FANCIES_FAILURE,
  });
  