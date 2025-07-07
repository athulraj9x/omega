//this is for fetching Events from external Api
import {
  BONUS,
  BONUS_SUCCESS,
  BONUS_FAILURE,
  GET_BONUS,
  GET_BONUS_SUCCESS,
  GET_BONUS_FAILURE
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  bonus: null,
};

const bonusReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case BONUS:
      return { ...state, loading: true };
    case BONUS_SUCCESS:
      return { ...state, bonus: action.payload?.data, loading: false };
    case BONUS_FAILURE:
      return { ...state, loading: false };
    case GET_BONUS:
      return { ...state, loading: true };
    case GET_BONUS_SUCCESS:
      return { ...state, bonus: action.payload?.data, loading: false };
    case GET_BONUS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default bonusReducer;
