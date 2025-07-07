import {
  GET_BANNER,
  GET_BANNER_SUCCESS,
  GET_BANNER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  banners: [],
};

const getBannersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANNER:
      return { ...state, loading: true };
    case GET_BANNER_SUCCESS:
      return { ...state, allBets: action.payload, loading: false };
    case GET_BANNER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBannersReducer;
