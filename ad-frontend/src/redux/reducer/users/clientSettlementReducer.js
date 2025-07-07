import {
  CLIENT_SETTLEMENT,
  CLIENT_SETTLEMENT_SUCCESS,
  CLIENT_SETTLEMENT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const clientSettlement = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CLIENT_SETTLEMENT:
      return { ...state, loading: true };
    case CLIENT_SETTLEMENT_SUCCESS:
      return { ...state, loading: false };
    case CLIENT_SETTLEMENT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default clientSettlement;
