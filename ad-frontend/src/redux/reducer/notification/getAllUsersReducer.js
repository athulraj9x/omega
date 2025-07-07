import {
  GETALLUSERS,
  GETALLUSERSFAILURE,
  GETALLUSERSSUCCESS,
} from "../../action/types";
const INIT_STATE = {
  allusers: null,
  loading: false,
};

const getAllusersReduer = (state = INIT_STATE, action) => {
  switch (action?.type) {
    case GETALLUSERS:
      return { ...state, loading: true };
    case GETALLUSERSSUCCESS:
      return { ...state, allusers: action.payload, loading: false };
    case GETALLUSERSFAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default getAllusersReduer;
