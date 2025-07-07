import {
  GET_BETS_AND_BOOKS,
  GET_BETS_AND_BOOKS_SUCCESS,
  GET_BETS_AND_BOOKS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  allData: null,
};

const getBetsAndBooks = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BETS_AND_BOOKS:
      return { ...state, loading: true };
    case GET_BETS_AND_BOOKS_SUCCESS:
      return { ...state, allData: action.payload, loading: false };
    case GET_BETS_AND_BOOKS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBetsAndBooks;
