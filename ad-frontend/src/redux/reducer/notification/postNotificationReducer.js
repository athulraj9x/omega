import {
  POSTNOTIFICATION,
  POSTNOTIFICATIONSUCCESS,
  POSTNOTIFICATIONFAILURE,
} from "../../action/types";
const INIT_STATE = {
  loading: false,
};

const addPostNotificationReducer = (state = INIT_STATE, action) => {
  switch (action?.type) {
    case POSTNOTIFICATION:
      return { ...state, loading: true };
    case POSTNOTIFICATIONSUCCESS:
      return { ...state, loading: false };
    case POSTNOTIFICATIONFAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default addPostNotificationReducer;
