import {
  ADD_PANEL,
  ADD_PANEL_SUCCESS,
  ADD_PANEL_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addPanel = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_PANEL:
      return { ...state, loading: true };
    case ADD_PANEL_SUCCESS:
      return { ...state, loading: false };
    case ADD_PANEL_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addPanel;
