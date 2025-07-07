import {
  UPDATE_CLIENT_SHARES,
  UPDATE_CLIENT_SHARES_SUCCESS,
  UPDATE_CLIENT_SHARES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateClientShare = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_CLIENT_SHARES:
      return { ...state, loading: true };
    case UPDATE_CLIENT_SHARES_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_CLIENT_SHARES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateClientShare;
