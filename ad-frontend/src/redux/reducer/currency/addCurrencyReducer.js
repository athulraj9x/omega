import { ADD_CURRENCY, ADD_CURRENCY_SUCCESS, ADD_CURRENCY_FAILURE } from "../../action/types";

const INIT_STATE = {
  currencies: [],
  loading: false
};

const currencyReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_CURRENCY:
      return { ...state, loading: true };
    case ADD_CURRENCY_SUCCESS:
      return { ...state, loading: false };
    case ADD_CURRENCY_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default currencyReducer;
