import {
  GET_SETTLEMENT,
  GET_SETTLEMENT_SUCCESS,
  GET_SETTLEMENT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  data: null,
};

const getSettlement = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SETTLEMENT:
      return { ...state, loading: true };
    case GET_SETTLEMENT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_SETTLEMENT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getSettlement;
