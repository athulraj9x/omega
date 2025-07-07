import {
  GET_RESULT_TRANSACTION,
  GET_RESULT_TRANSACTION_SUCCESS,
  GET_RESULT_TRANSACTION_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  resultTransactionData: null,
};

const resultTransactionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RESULT_TRANSACTION:
      return { ...state, loading: true };
    case GET_RESULT_TRANSACTION_SUCCESS:
      return { ...state, resultTransactionData: action.payload, loading: false };
    case GET_RESULT_TRANSACTION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default resultTransactionReducer;
