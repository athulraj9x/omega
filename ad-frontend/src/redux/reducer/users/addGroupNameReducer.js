
import {
  ADD_GROUP_NAME,
  ADD_GROUP_NAME_SUCCESS,
  ADD_GROUP_NAME_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addGroupName = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_GROUP_NAME:
      return { ...state, loading: true };
    case ADD_GROUP_NAME_SUCCESS:
      return { ...state, loading: false };
    case ADD_GROUP_NAME_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addGroupName;
