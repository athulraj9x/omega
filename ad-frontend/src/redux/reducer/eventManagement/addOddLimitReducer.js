import {
  ADD_ODDLIMIT,
  ADD_ODDLIMIT_SUCCESS,
  ADD_ODDLIMIT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addOddLimitReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_ODDLIMIT:
      return { ...state, loading: true };
    case ADD_ODDLIMIT_SUCCESS:
      return { ...state, loading: false };
    case ADD_ODDLIMIT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addOddLimitReducer;
