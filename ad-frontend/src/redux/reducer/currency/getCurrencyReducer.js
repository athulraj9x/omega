import {
  GET_CURRENCY,
  GET_CURRENCY_SUCCESS,
  GET_CURRENCY_FAILURE,
  UPDATE_CURRENCY_SUCCESS, UPDATE_CURRENCY_FAILURE, UPDATE_CURRENCY_REQUEST
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  currencyData: null,
};

const currencyReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CURRENCY:
      return { ...state, loading: true };
    case GET_CURRENCY_SUCCESS:
      return { ...state, currencyData: action?.payload?.data
        , loading: false };
    case GET_CURRENCY_FAILURE:
      return { ...state, loading: false };
    case UPDATE_CURRENCY_REQUEST:
      return {
        ...state
      };
    case UPDATE_CURRENCY_SUCCESS:
      return {
        ...state,
        currencyData: action.payload
      };
    case UPDATE_CURRENCY_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default currencyReducer;
