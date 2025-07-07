import {
    SEARCH_BASED_ON_EVENTS,
    SEARCH_BASED_ON_EVENTS_FAILURE,
    SEARCH_BASED_ON_EVENTS_SUCCESS,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    searchResult: null,
  };
  
  const getSearchResultReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case SEARCH_BASED_ON_EVENTS:
        return { ...state, loading: true };
      case SEARCH_BASED_ON_EVENTS_SUCCESS:
        return { ...state, searchResult: action.payload, loading: false };
      case SEARCH_BASED_ON_EVENTS_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getSearchResultReducer;
  