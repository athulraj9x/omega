import {
  DELETE_BANK_DETAILS,
  DELETE_BANK_DETAILS_SUCCESS,
  DELETE_BANK_DETAILS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};
const delelteBankDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DELETE_BANK_DETAILS:
      return { ...state, loading: true };
    case DELETE_BANK_DETAILS_SUCCESS:
      return { ...state, loading: false };
    case DELETE_BANK_DETAILS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default delelteBankDataReducer