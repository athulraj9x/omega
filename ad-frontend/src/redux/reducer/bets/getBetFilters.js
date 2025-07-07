// import { getDefaultState } from "../../../utils/helper";
import {
  GET_BET_FILTER,
  GET_BET_FILTER_SUCCESS,
  GET_BET_FILTER_FAILURE,
} from "../../action/types";

// const defaultUserData = getDefaultState("userData");

const INIT_STATE = {
  loading: false,
  filters: [],
};

const getBetFilterReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BET_FILTER:
      return { ...state, loading: true };
    case GET_BET_FILTER_SUCCESS:
      return { ...state, filters: action?.payload, loading: false };
    case GET_BET_FILTER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBetFilterReducer;
