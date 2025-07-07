import {
  ADD_RACE_EVENTS,
  ADD_RACE_EVENTS_SUCCESS,
  ADD_RACE_EVENTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addRaceEvents = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_RACE_EVENTS:
      return { ...state, loading: true };
    case ADD_RACE_EVENTS_SUCCESS:
      return { ...state, loading: false };
    case ADD_RACE_EVENTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addRaceEvents;
