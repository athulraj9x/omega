//this is for fetching Events from external Api

import {
  SET_COMMISSION_VALUE,
  SET_COMMISSION_VALUE_SUCCESS,
  SET_COMMISSION_VALUE_FAILURE,
} from "../types";

export const setCommissionValue = (payload) => ({
  type: SET_COMMISSION_VALUE,
  payload,
});

export const setCommissionValueSuccess = (payload) => ({
  type: SET_COMMISSION_VALUE_SUCCESS,
  payload,
});

export const setCommissionValueFailure = () => ({
  type: SET_COMMISSION_VALUE_FAILURE,
});
