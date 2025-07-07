import {
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATIONSUCCESS,
  DELETE_NOTIFICATION_FAILURE,
} from "../../action/types";
const INIT_STATE = {
  loading: false,
};

const deleteNotificationReducer = (state = INIT_STATE, action) => {
  switch (action?.type) {
    case DELETE_NOTIFICATION:
      return { ...state, loading: true };
    case DELETE_NOTIFICATIONSUCCESS:
      return { ...state, loading: false };
    case DELETE_NOTIFICATION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default deleteNotificationReducer;
