import {
  TWO_AUTHENTICATION,
  TWO_AUTHENTICATION_SUCCESS,
  TWO_AUTHENTICATION_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  userHistory: null,
};

const twoAuthenticationReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case TWO_AUTHENTICATION:
      return { ...state, loading: true };
    case TWO_AUTHENTICATION_SUCCESS:
      return { ...state, loading: false };
    case TWO_AUTHENTICATION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default twoAuthenticationReducer;
