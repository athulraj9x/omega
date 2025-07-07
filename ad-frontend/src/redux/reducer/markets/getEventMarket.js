import {
  GET_EVENT_MARKET,
  GET_EVENT_MARKET_FAILURE,
  GET_EVENT_MARKET_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  eventMarkets: null,
};

const getEventMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EVENT_MARKET:
      return { ...state, loading: true };
    case GET_EVENT_MARKET_SUCCESS:
      return { ...state, eventMarkets: action.payload, loading: false };
    case GET_EVENT_MARKET_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getEventMarketReducer;
