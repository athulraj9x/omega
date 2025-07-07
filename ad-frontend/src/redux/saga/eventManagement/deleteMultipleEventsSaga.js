import { all, call, put, takeEvery } from "redux-saga/effects";
import { DELETE_MULTIPLE_EVENTS } from "../../action/types";
import { toast } from "react-toastify";
import {
  deleteMultipleEventSuccess,
  deleteMultipleEventFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* deleteMultipleEventsRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/delete-multiple-events",
      action?.payload
    ); // Add the URL from Backend & send data
    if (data?.meta?.code === 200) {
      yield put(deleteMultipleEventSuccess(data?.data));
      yield call(action?.payload?.callback, data?.meta);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 401) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action?.payload?.callback, data);
      //   yield put(deleteMultipleEventFailure());
      invalidTokenAction();
    } else if (data?.code === 400) {
      yield put(deleteMultipleEventFailure());
      //   yield call(action?.payload?.callback, data);
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(deleteMultipleEventFailure());
      //   yield call(action?.payload?.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(deleteMultipleEventFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDepositAPI() {
  yield takeEvery(DELETE_MULTIPLE_EVENTS, deleteMultipleEventsRequest);
}

export default function* rootSaga() {
  yield all([watchDepositAPI()]);
}
