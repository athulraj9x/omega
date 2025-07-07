import {
  LOGIN_HISTORY,
  LOGIN_HISTORY_SUCCESS,
  LOGIN_HISTORY_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  userHistory: null,
};

const loginHistoryReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_HISTORY:
      return { ...state, loading: true };
    case LOGIN_HISTORY_SUCCESS:
      return { ...state, userHistory: action?.payload, loading: false };
    case LOGIN_HISTORY_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loginHistoryReducer;
