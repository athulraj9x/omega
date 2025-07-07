import {
  DELETE_EVENT_DATA,
  DELETE_EVENT_DATA_SUCCESS,
  DELETE_EVENT_DATA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const deleteEventsDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DELETE_EVENT_DATA:
      return { ...state, loading: true };
    case DELETE_EVENT_DATA_SUCCESS:
      return { ...state, loading: false };
    case DELETE_EVENT_DATA_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default deleteEventsDataReducer;
