import {
  UPDATE_TWO_FACTOR_STATUS,
  UPDATE_TWO_FACTOR_STATUS_FAILURE,
  UPDATE_TWO_FACTOR_STATUS_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateTwoFactorStatusReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_TWO_FACTOR_STATUS:
      return { ...state, loading: true };
    case UPDATE_TWO_FACTOR_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_TWO_FACTOR_STATUS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateTwoFactorStatusReducer;
