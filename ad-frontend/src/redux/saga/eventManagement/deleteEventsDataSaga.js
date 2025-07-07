import { all, call, put, takeEvery } from "redux-saga/effects";
import { DELETE_EVENT_DATA } from "../../action/types";
import { toast } from "react-toastify";
import {
  deleteEventDataSuccess,
  deleteEventDataFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* deleteEventsDataRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/delete-events-data",
      action?.payload
    ); // Add the URL from Backend & send data
    if (data?.meta?.code === 200) {
      yield put(deleteEventDataSuccess(data?.data));
      yield call(action?.payload?.callback, data?.meta);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 401) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action?.payload?.callback, data);
      //   yield put(deleteEventDataFailure());
      invalidTokenAction();
    } else if (data?.code === 400) {
      yield put(deleteEventDataFailure());
      //   yield call(action?.payload?.callback, data);
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(deleteEventDataFailure());
      //   yield call(action?.payload?.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(deleteEventDataFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDeleteEventAPI() {
  yield takeEvery(DELETE_EVENT_DATA, deleteEventsDataRequest);
}

export default function* rootSaga() {
  yield all([watchDeleteEventAPI()]);
}
