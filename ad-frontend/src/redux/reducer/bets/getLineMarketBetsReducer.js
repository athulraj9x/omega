import {
  GET_LINE_MARKET_BETS,
  GET_LINE_MARKET_BETS_SUCCESS,
  GET_LINE_MARKET_BETS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  lineMarketBets: []
};

const getLineMarketBets = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LINE_MARKET_BETS:
      return { ...state, loading: true };
    case GET_LINE_MARKET_BETS_SUCCESS:
      return { ...state, lineMarketBets: action.payload, loading: false };
    case GET_LINE_MARKET_BETS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getLineMarketBets;