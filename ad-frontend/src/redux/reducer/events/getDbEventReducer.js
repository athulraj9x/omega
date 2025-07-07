import {
  GET_DBEVENT,
  GET_DBEVENT_SUCCESS,
  GET_DBEVENT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  eventData: null,
};

const getDbEventReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DBEVENT:
      return { ...state, loading: true };
    case GET_DBEVENT_SUCCESS:
      return { ...state, leagueData: action.payload, loading: false };
    case GET_DBEVENT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getDbEventReducer;
