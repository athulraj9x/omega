import { SEARCH_BASED_ON_EVENTS, SEARCH_BASED_ON_EVENTS_FAILURE, SEARCH_BASED_ON_EVENTS_SUCCESS } from "../../action/types";


const INIT_STATE = {
  loading: false,
  data: null,
};

const searchBasedOnEventsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SEARCH_BASED_ON_EVENTS:
      return { ...state, loading: true };
    case SEARCH_BASED_ON_EVENTS_SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case SEARCH_BASED_ON_EVENTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default searchBasedOnEventsReducer;
