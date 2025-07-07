import {
  SET_PRIORITY_LINE_MARKET,
  SET_PRIORITY_LINE_MARKET_FAILURE,
  SET_PRIORITY_LINE_MARKET_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  setPriorityLineMarket:Object
};

const setPriorityLineMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_PRIORITY_LINE_MARKET:
      return { ...state, loading: true };
    case SET_PRIORITY_LINE_MARKET_SUCCESS:
      return { ...state, setPriorityLineMarket: { ...state.setPriorityLineMarket, data:action.payload }, loading: false };
    case SET_PRIORITY_LINE_MARKET_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default setPriorityLineMarketReducer;
