import {
  GET_USERBETS_EVENT,
  GET_USERBETS_EVENT_SUCCESS,
  GET_USERBETS_EVENT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  allBets: null,
};

const getUserBetsEvent = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERBETS_EVENT:
      return { ...state, loading: true };
    case GET_USERBETS_EVENT_SUCCESS:
      return { ...state, allBets: action.payload, loading: false };
    case GET_USERBETS_EVENT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getUserBetsEvent;
