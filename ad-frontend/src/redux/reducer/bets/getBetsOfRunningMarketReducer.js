import {
  GET_BETS_OF_RUNNING_MARKET,
  GET_BETS_OF_RUNNING_MARKET_SUCCESS,
  GET_BETS_OF_RUNNING_MARKET_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  bets: null,
};

const getBetsOfRunningMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BETS_OF_RUNNING_MARKET:
      return { ...state, loading: true };
    case GET_BETS_OF_RUNNING_MARKET_SUCCESS:
      return { ...state, bets: action.payload, loading: false };
    case GET_BETS_OF_RUNNING_MARKET_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBetsOfRunningMarketReducer;
