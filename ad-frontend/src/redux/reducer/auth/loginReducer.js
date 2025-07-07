import { getDefaultState } from "../../../utils/helper";
import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE } from "../../action/types";

const defaultUserData = getDefaultState("userData");

const INIT_STATE = {
  loading: false,
  userData: defaultUserData,
};

const loginReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { ...state, userData: action?.payload, loading: false };
    case LOGIN_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loginReducer;
