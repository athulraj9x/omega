import {
  SETTLEMENT,
  SETTLEMENT_SUCCESS,
  SETTLEMENT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const postSettlement = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SETTLEMENT:
      return { ...state, loading: true };
    case SETTLEMENT_SUCCESS:
      return { ...state, loading: false };
    case SETTLEMENT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default postSettlement;
