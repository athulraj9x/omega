import {
  SETTLEMENT_ROLLBACK,
  SETTLEMENT_ROLLBACK_SUCCESS,
  SETTLEMENT_ROLLBACK_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const settlementRollBackReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SETTLEMENT_ROLLBACK:
      return { ...state, loading: true };
    case SETTLEMENT_ROLLBACK_SUCCESS:
      return { ...state, loading: false };
    case SETTLEMENT_ROLLBACK_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default settlementRollBackReducer;
