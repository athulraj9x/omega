//this is for fetching Sports from external Api

import { GET_BANKING_DATA, GET_BANKING_DATA_SUCCESS, GET_BANKING_DATA_FAILURE } from "../types";

export const getBankingData = () => ({
  type: GET_BANKING_DATA,
});

export const getBankingDataSuccess = (payload) => ({
  type: GET_BANKING_DATA_SUCCESS,
  payload,
});

export const getBankingDataFailure = () => ({
  type: GET_BANKING_DATA_FAILURE,
});
