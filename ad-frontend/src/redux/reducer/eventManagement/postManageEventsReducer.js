import {
  UPDATE_EVENTMANAGEMENT_DATAS,
  UPDATE_EVENTMANAGEMENT_DATAS_SUCCESS,
  UPDATE_EVENTMANAGEMENT_DATAS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_EVENTMANAGEMENT_DATAS:
      return { ...state, loading: true };
    case UPDATE_EVENTMANAGEMENT_DATAS_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_EVENTMANAGEMENT_DATAS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateDataReducer;
