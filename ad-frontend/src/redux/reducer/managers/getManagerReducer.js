import {
  GET_MANAGERS,
  GET_MANAGERS_SUCCESS,
  GET_MANAGERS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  managersData: null,
};

const managersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MANAGERS:
      return { ...state, loading: true };
    case GET_MANAGERS_SUCCESS:
      return { ...state, managersData: action.payload, loading: false };
    case GET_MANAGERS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default managersReducer;
