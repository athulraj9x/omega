import {
  EDITNOTIFICATION,
  EDITNOTIFICATIONFAILURE,
  EDITNOTIFICATIONSUCCESS,
} from "../types";

export const editNotification = (payload) => ({
  type: EDITNOTIFICATION,
  payload,
});

export const editNotificationSuccess = (payload) => ({
  type: EDITNOTIFICATIONSUCCESS,
  payload,
});

export const editNotificationFailure = () => ({
  type: EDITNOTIFICATIONFAILURE,
});
