import {
  GET_MANAGE_EVENTDATA,
  GET_MANAGE_EVENTDATA_SUCCESS,
  GET_MANAGE_EVENTDATA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  manageData: null,
};

const manageEventsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MANAGE_EVENTDATA:
      return { ...state, loading: true };
    case GET_MANAGE_EVENTDATA_SUCCESS:
      return { ...state, manageData: action.payload, loading: false };
    case GET_MANAGE_EVENTDATA_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default manageEventsReducer;
