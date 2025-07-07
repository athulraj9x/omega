import {
  GET_ALLBETS,
  GET_ALLBETS_SUCCESS,
  GET_ALLBETS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  allBets: null,
};

const allBetsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALLBETS:
      return { ...state, loading: true };
    case GET_ALLBETS_SUCCESS:
      return { ...state, allBets: action.payload, loading: false };
    case GET_ALLBETS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default allBetsReducer;
