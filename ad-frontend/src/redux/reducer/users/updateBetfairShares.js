import {
  UPDATE_BETFAIR_SHARES,
  UPDATE_BETFAIR_SHARES_SUCCESS,
  UPDATE_BETFAIR_SHARES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateBetfairShare = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_BETFAIR_SHARES:
      return { ...state, loading: true };
    case UPDATE_BETFAIR_SHARES_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_BETFAIR_SHARES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateBetfairShare;
