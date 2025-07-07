import {
  GET_DBRUNNERS,
  GET_DBRUNNERS_SUCCESS,
  GET_DBRUNNERS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  runnerData: null,
};

const getDbRunnersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DBRUNNERS:
      return { ...state, loading: true };
    case GET_DBRUNNERS_SUCCESS:
      return { ...state, runnerData: action.payload, loading: false };
    case GET_DBRUNNERS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getDbRunnersReducer;
