import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_ODDLIMIT } from "../../action/types";
import {
  addOddLimitSuccess,
  addOddLimitFailure,
} from "../../action/eventManagement/addOddLimitAction";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* addOddLimitRequest(action) {
  try {
    const { data } = yield API.post("admin/add-odd-limit", action?.payload);
    if (data.meta.code === 200) {
      yield put(addOddLimitSuccess(data.data));
      yield call(action.payload.callback, data);
      toast.dismiss();

      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(addOddLimitFailure());
      toast.dismiss();
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(addOddLimitFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(addOddLimitFailure());
    toast.dismiss();
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddOddLimitAPI() {
  yield takeEvery(ADD_ODDLIMIT, addOddLimitRequest);
}

export default function* rootSaga() {
  yield all([watchAddOddLimitAPI()]);
}
