import {
    ADD_PERMISSION,
    ADD_PERMISSION_SUCCESS,
    ADD_PERMISSION_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const addPermission = (state = INIT_STATE, action) => {
    switch (action.type) {
      case ADD_PERMISSION:
        return { ...state, loading: true };
      case ADD_PERMISSION_SUCCESS:
        return { ...state, loading: false };
      case ADD_PERMISSION_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default addPermission;
  
  