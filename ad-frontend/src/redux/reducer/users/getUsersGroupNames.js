import {
  GET_USERS_GROUPS,
  GET_USERS_GROUPS_FAILURE,
  GET_USERS_GROUPS_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  usersGroup: null,
};

const getUsersGroupNames = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS_GROUPS:
      return { ...state, loading: true };
    case GET_USERS_GROUPS_SUCCESS:
      return { ...state, usersGroup: action.payload, loading: false };
    case GET_USERS_GROUPS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getUsersGroupNames;
