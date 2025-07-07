// import { getDefaultState } from "../../../utils/helper";
import { GET_BET_STATUS, GET_BET_STATUS_SUCCESS, GET_BET_STATUS_FAILURE } from "../../action/types";

// const defaultUserData = getDefaultState("userData");

const INIT_STATE = {
  loading: false,
};

const getBetStatusReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BET_STATUS:
      return { ...state, loading: true };
    case GET_BET_STATUS_SUCCESS:
      return { ...state, loading: false };
    case GET_BET_STATUS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBetStatusReducer;
