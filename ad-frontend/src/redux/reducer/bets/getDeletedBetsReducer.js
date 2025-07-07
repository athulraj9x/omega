// import { getDefaultState } from "../../../utils/helper";
import {
  GET_DELETED_BETS,
  GET_DELETED_BETS_SUCCESS,
  GET_DELETED_BETS_FAILURE,
} from "../../action/types";

// const defaultUserData = getDefaultState("userData");

const INIT_STATE = {
  loading: false,
  bets: [],
};

const getDeletedBetsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DELETED_BETS:
      return { ...state, loading: true };
    case GET_DELETED_BETS_SUCCESS:
      return { ...state, bets: action?.payload, loading: false };
    case GET_DELETED_BETS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getDeletedBetsReducer;
