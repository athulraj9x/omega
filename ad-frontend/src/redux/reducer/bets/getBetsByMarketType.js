import {
  GET_BET_BY_MARKETTYPE,
  GET_BET_BY_MARKETTYPE_SUCCESS,
  GET_BET_BY_MARKETTYPE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  bets: null,
};

const getBetsByMarketType = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BET_BY_MARKETTYPE:
      return { ...state, loading: true };
    case GET_BET_BY_MARKETTYPE_SUCCESS:
      return { ...state, bets: action.payload, loading: false };
    case GET_BET_BY_MARKETTYPE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBetsByMarketType;
