import {
  ADD_RESULT,
  ADD_RESULT_SUCCESS,
  ADD_RESULT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addResult = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_RESULT:
      return { ...state, loading: true };
    case ADD_RESULT_SUCCESS:
      return { ...state, loading: false };
    case ADD_RESULT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addResult;
