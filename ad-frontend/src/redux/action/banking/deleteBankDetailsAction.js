import {
  DELETE_BANK_DETAILS,
  DELETE_BANK_DETAILS_SUCCESS,
  DELETE_BANK_DETAILS_FAILURE,
} from "../types";

export const deleteBankDetailsAction = (payload) =>({
    type:DELETE_BANK_DETAILS,
    payload
})
export const deleteBankDetailsActionSuccess = (payload) =>({
    type:DELETE_BANK_DETAILS_SUCCESS,
    payload
})
export const deleteBankDetailsActionFailure = () =>({
    type:DELETE_BANK_DETAILS_FAILURE
})
