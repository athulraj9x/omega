import {
  GET_FANCY_MARKET_BETS,
  GET_FANCY_MARKET_BETS_SUCCESS,
  GET_FANCY_MARKET_BETS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  fancyBets: []
};

const getFancyMarketBets = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FANCY_MARKET_BETS:
      return { ...state, loading: true };
    case GET_FANCY_MARKET_BETS_SUCCESS:
      return { ...state, fancyBets: action.payload, loading: false };
    case GET_FANCY_MARKET_BETS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getFancyMarketBets;