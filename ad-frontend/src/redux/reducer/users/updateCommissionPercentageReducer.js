import {
  UPDATE_COMMISSION_PERCENTAGE,
  UPDATE_COMMISSION_PERCENTAGE_SUCCESS,
  UPDATE_COMMISSION_PERCENTAGE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateCommissionPercentage = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_COMMISSION_PERCENTAGE:
      return { ...state, loading: true };
    case UPDATE_COMMISSION_PERCENTAGE_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_COMMISSION_PERCENTAGE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateCommissionPercentage;
 