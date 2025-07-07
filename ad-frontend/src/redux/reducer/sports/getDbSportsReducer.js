import {
  GET_DBSPORTS,
  GET_DBSPORTS_SUCCESS,
  GET_DBSPORTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  sportsData: null,
};

const getDbSportsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DBSPORTS:
      return { ...state, loading: true };
    case GET_DBSPORTS_SUCCESS:
      return { ...state, sportsData: action.payload, loading: false };
    case GET_DBSPORTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getDbSportsReducer;
