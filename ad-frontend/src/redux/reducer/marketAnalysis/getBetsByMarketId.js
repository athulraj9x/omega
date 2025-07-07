import {
    GET_BETS_BY_MARKET_ID,
    GET_BETS_BY_MARKET_ID_FAILURE,
    GET_BETS_BY_MARKET_ID_SUCCESS,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    marketBets: null,
  };
  
  const getBetsByMarketIdReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_BETS_BY_MARKET_ID:
        return { ...state, loading: true };
      case GET_BETS_BY_MARKET_ID_SUCCESS:
        return { ...state, marketBets: action.payload, loading: false };
      case GET_BETS_BY_MARKET_ID_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getBetsByMarketIdReducer;
  