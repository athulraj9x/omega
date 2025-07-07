import {
  EDITNOTIFICATION,
  EDITNOTIFICATIONFAILURE,
  EDITNOTIFICATIONSUCCESS,
} from "../../action/types";
const INIT_STATE = {
  loading: false,
};

const editNotificationReducer = (state = INIT_STATE, action) => {
  switch (action?.type) {
    case EDITNOTIFICATION:
      return { ...state, loading: true };
    case EDITNOTIFICATIONSUCCESS:
      return { ...state, loading: false };
    case EDITNOTIFICATIONFAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default editNotificationReducer;
