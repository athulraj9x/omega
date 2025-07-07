import {
  GET_PRIORITY_DATA_BASED_EVENT_MARKET,
  GET_PRIORITY_DATA_BASED_EVENT_MARKET_FAILURE,
  GET_PRIORITY_DATA_BASED_EVENT_MARKET_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  getPriorityEventMarket:Object
};

const getPriorityEventMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRIORITY_DATA_BASED_EVENT_MARKET:
      return { ...state, loading: true };
    case GET_PRIORITY_DATA_BASED_EVENT_MARKET_SUCCESS:
      return { ...state, getPriorityEventMarket: { ...state.getPriorityEventMarket, data:action.payload }, loading: false };
    case GET_PRIORITY_DATA_BASED_EVENT_MARKET_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getPriorityEventMarketReducer;
