import {
  ROLLBACK,
  ROLLBACK_SUCCESS,
  ROLLBACK_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const rollBackReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ROLLBACK:
      return { ...state, loading: true };
    case ROLLBACK_SUCCESS:
      return { ...state, loading: false };
    case ROLLBACK_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default rollBackReducer;
