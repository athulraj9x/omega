import {
  GET_CASINO_BETS_BY_DATE,
  GET_CASINO_BETS_BY_DATE_SUCCESS,
  GET_CASINO_BETS_BY_DATE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  casinoBetsData: null,
};

const getCasinoBetsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CASINO_BETS_BY_DATE:
      return { ...state, loading: true };
    case GET_CASINO_BETS_BY_DATE_SUCCESS:
      return { ...state, casinoBetsData: action.payload, loading: false };
    case GET_CASINO_BETS_BY_DATE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getCasinoBetsReducer;
