import {
  DELETE_USERBET,
  DELETE_USERBET_SUCCESS,
  DELETE_USERBET_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  //   allBets: null,
};

const deleteBetReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DELETE_USERBET:
      return { ...state, loading: true };
    case DELETE_USERBET_SUCCESS:
      return { ...state, loading: false };
    case DELETE_USERBET_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default deleteBetReducer;
