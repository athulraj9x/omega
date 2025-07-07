//this is for fetching Events from external Api

import {
  GET_EVENTS,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  eventsData: null,
};

const getEventsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return { ...state, loading: true };
    case GET_EVENTS_SUCCESS:
      return { ...state, eventsData: action.payload, loading: false };
    case GET_EVENTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getEventsReducer;
