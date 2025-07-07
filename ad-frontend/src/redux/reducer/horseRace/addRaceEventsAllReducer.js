import {
    ADD_HORSE_RACE_MATCH_ALL , ADD_HORSE_RACE_MATCH_ALL_SUCCESS , ADD_HORSE_RACE_MATCH_ALL_FAILURE
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const addRaceEventsAll = (state = INIT_STATE, action) => {
    switch (action.type) {
      case ADD_HORSE_RACE_MATCH_ALL:
        return { ...state, loading: true };
      case ADD_HORSE_RACE_MATCH_ALL_SUCCESS:
        return { ...state, loading: false };
      case ADD_HORSE_RACE_MATCH_ALL_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default addRaceEventsAll;
  