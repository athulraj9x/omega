import {
  GET_DBLEAGUES,
  GET_DBLEAGUES_SUCCESS,
  GET_DBLEAGUES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  leagueData: null,
};

const getDbLeaguesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DBLEAGUES:
      return { ...state, loading: true };
    case GET_DBLEAGUES_SUCCESS:
      return { ...state, leagueData: action.payload, loading: false };
    case GET_DBLEAGUES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getDbLeaguesReducer;
