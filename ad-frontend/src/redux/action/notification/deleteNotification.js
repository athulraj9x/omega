import {
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATIONSUCCESS,
  DELETE_NOTIFICATION_FAILURE,
} from "../types";

export const deleteNotification = (payload) => ({
  type: DELETE_NOTIFICATION,
  payload,
});

export const deleteNotificationSucess = (payload) => ({
  type: DELETE_NOTIFICATIONSUCCESS,
});

export const deleteNotificationFailure = () => ({
  type: DELETE_NOTIFICATION_FAILURE,
});
