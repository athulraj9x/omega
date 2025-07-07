import {
  DELETE_MULTIPLE_EVENTS,
  DELETE_MULTIPLE_EVENTS_SUCCESS,
  DELETE_MULTIPLE_EVENTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const deleteMultipleEventsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DELETE_MULTIPLE_EVENTS:
      return { ...state, loading: true };
    case DELETE_MULTIPLE_EVENTS_SUCCESS:
      return { ...state, loading: false };
    case DELETE_MULTIPLE_EVENTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default deleteMultipleEventsReducer;
