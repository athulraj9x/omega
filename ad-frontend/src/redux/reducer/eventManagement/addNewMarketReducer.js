import {
  ADD_NEW_MARKET,
  ADD_NEW_MARKET_SUCCESS,
  ADD_NEW_MARKET_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addNewMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_NEW_MARKET:
      return { ...state, loading: true };
    case ADD_NEW_MARKET_SUCCESS:
      return { ...state, loading: false };
    case ADD_NEW_MARKET_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addNewMarketReducer;
