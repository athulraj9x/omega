import {
  GET_RESULT_TRANSACTION_DETAILS,
  GET_RESULT_TRANSACTION_DETAILS_SUCCESS,
  GET_RESULT_TRANSACTION_DETAILS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  resultTransactionData: null,
};

const resultTransactionDetailReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RESULT_TRANSACTION_DETAILS:
      return { ...state, loading: true };
    case GET_RESULT_TRANSACTION_DETAILS_SUCCESS:
      return {
        ...state,
        resultTransactionData: action.payload,
        loading: false,
      };
    case GET_RESULT_TRANSACTION_DETAILS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default resultTransactionDetailReducer;
