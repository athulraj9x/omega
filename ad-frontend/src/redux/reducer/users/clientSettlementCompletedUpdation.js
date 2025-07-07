import {
  CLIENT_SETTLEMENT_COMPLETED_UPDATION,
  CLIENT_SETTLEMENT_COMPLETED_UPDATION_FAILURE,
  CLIENT_SETTLEMENT_COMPLETED_UPDATION_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const clientSettlementCompletedUpdation = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CLIENT_SETTLEMENT_COMPLETED_UPDATION:
      return { ...state, loading: true };
    case CLIENT_SETTLEMENT_COMPLETED_UPDATION_SUCCESS:
      return { ...state, loading: false };
    case CLIENT_SETTLEMENT_COMPLETED_UPDATION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default clientSettlementCompletedUpdation;
