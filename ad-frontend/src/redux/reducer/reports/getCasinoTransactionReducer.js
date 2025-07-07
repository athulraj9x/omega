import {
  GET_CASINO_TRANSACTION,
  GET_CASINO_TRANSACTION_SUCCESS,
  GET_CASINO_TRANSACTION_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  casinoTransactionData: null,
};

const casinoTransactionReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CASINO_TRANSACTION:
      return { ...state, loading: true };
    case GET_CASINO_TRANSACTION_SUCCESS:
      return {
        ...state,
        casinoTransactionData: action.payload,
        loading: false,
      };
    case GET_CASINO_TRANSACTION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default casinoTransactionReducer;
