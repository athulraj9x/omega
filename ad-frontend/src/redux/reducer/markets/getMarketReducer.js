//this is for fetching Markets from external Api

import {
  GET_MARKETS,
  GET_MARKETS_SUCCESS,
  GET_MARKETS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  marketData: null,
};

const getMarketReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MARKETS:
      return { ...state, loading: true };
    case GET_MARKETS_SUCCESS:
      return { ...state, marketData: action.payload, loading: false };
    case GET_MARKETS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getMarketReducer;
