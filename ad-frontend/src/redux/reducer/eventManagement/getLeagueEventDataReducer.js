import { GET_LEAGUE_EVENT_DATA, GET_LEAGUE_EVENT_DATA_FAILURE, GET_LEAGUE_EVENT_DATA_SUCCESS } from "../../action/types";


const INIT_STATE = {
  loading: false,
  data: null,
};

const getEventLeagueDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LEAGUE_EVENT_DATA:
      return { ...state, loading: true };
    case GET_LEAGUE_EVENT_DATA_SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case GET_LEAGUE_EVENT_DATA_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getEventLeagueDataReducer;
