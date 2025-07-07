import {
  ADD_BANNER,
  ADD_BANNER_SUCCESS,
  ADD_BANNER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addBanner = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_BANNER:
      return { ...state, loading: true };
    case ADD_BANNER_SUCCESS:
      return { ...state, loading: false };
    case ADD_BANNER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addBanner;
