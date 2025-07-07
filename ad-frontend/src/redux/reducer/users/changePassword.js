import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const changePassword = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD:
      return { ...state, loading: true };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false };
    case CHANGE_PASSWORD_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default changePassword;
