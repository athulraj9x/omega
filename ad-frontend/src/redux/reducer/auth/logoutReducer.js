import { LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE } from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const logoutReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, loading: true };
    case LOGOUT_SUCCESS:
      return { ...state, loading: false };
    case LOGOUT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default logoutReducer;
