import {
  POSTNOTIFICATION,
  POSTNOTIFICATIONSUCCESS,
  POST_LEAGUE_SETTING_FAILURE,
} from "../types";

export const postNotification = (payload) => ({
  type: POSTNOTIFICATION,
  payload,
});

export const postNotificationSuccess = (payload) => ({
  type: POSTNOTIFICATIONSUCCESS,
  payload,
});

export const postNotificationFailure = () => ({
  type: POST_LEAGUE_SETTING_FAILURE,
});
