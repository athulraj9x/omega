import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_SUCCESS,
  TRANSACTION_STATUS_FAILURE
} from "../../action/types";

const INIT_STATE = {
  loading: false
};

const transactionStatusReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case TRANSACTION_STATUS:
      return { ...state, loading: true };
    case TRANSACTION_STATUS_SUCCESS:
      return { ...state, loading: false };
    case TRANSACTION_STATUS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default transactionStatusReducer;
