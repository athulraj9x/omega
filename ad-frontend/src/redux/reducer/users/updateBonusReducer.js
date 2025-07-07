
import {
  UPDATE_BONUS, UPDATE_BONUS_SUCCESS, UPDATE_BONUS_FAILURE
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateBonus = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_BONUS:
      return { ...state, loading: true };
    case UPDATE_BONUS_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_BONUS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateBonus;
