import {
  GET_BANKING_DATA,
  GET_BANKING_DATA_SUCCESS,
  GET_BANKING_DATA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  bankingData: null,
};

const getBankingDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANKING_DATA:
      return { ...state, loading: true };
    case GET_BANKING_DATA_SUCCESS:
      return { ...state, bankingData: action.payload, loading: false };
    case GET_BANKING_DATA_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBankingDataReducer;
