import {
  GET_LINE_MARKETS,
  GET_LINE_MARKETS_SUCCESS,
  GET_LINE_MARKETS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  marketData: null,
};

const lineMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LINE_MARKETS:
      return { ...state, loading: true };
    case GET_LINE_MARKETS_SUCCESS:
      return { ...state, manageData: action.payload, loading: false };
    case GET_LINE_MARKETS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default lineMarketReducer;
