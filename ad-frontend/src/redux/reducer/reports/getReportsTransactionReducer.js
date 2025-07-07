import {
  GET_REPORT_TRANSACTION,
  GET_REPORT_TRANSACTION_SUCCESS,
  GET_REPORT_TRANSACTION_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  reportTransactionData: null,
};

const reportTransactionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REPORT_TRANSACTION:
      return { ...state, loading: true };
    case GET_REPORT_TRANSACTION_SUCCESS:
      return { ...state, reportTransactionData: action.payload, loading: false };
    case GET_REPORT_TRANSACTION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default reportTransactionReducer;
