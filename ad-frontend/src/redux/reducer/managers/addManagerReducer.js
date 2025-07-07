import {
  ADD_MANAGER,
  ADD_MANAGER_SUCCESS,
  ADD_MANAGER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addManager = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_MANAGER:
      return { ...state, loading: true };
    case ADD_MANAGER_SUCCESS:
      return { ...state, loading: false };
    case ADD_MANAGER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addManager;
