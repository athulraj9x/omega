import {
  CHANGE_BETFAIR_CURRENCY,
  CHANGE_BETFAIR_CURRENCY_SUCCESS,
  CHANGE_BETFAIR_CURRENCY_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const changeBetfairCurrencyReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_BETFAIR_CURRENCY:
      return { ...state, loading: true };
    case CHANGE_BETFAIR_CURRENCY_SUCCESS:
      return { ...state, loading: false };
    case CHANGE_BETFAIR_CURRENCY_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default changeBetfairCurrencyReducer;
