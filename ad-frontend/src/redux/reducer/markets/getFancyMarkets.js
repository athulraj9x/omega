import {
  GET_ACTIVE_FANCIES,
  GET_ACTIVE_FANCIES_SUCCESS,
  GET_ACTIVE_FANCIES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  fancyData: null,
};

const getActiveFanciesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVE_FANCIES:
      return { ...state, loading: true };
    case GET_ACTIVE_FANCIES_SUCCESS:
      return { ...state, fancyData: action.payload, loading: false };
    case GET_ACTIVE_FANCIES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getActiveFanciesReducer;
