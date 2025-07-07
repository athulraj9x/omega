import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_BONUS } from "../../action/types";
import {
  updateBonusFailure,
  updateBonusSuccess,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* updateBonusRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-bonus",
      action.payload.data
    );
    let responseData = data;
    if (responseData.meta.code === 200) {
      yield put(updateBonusSuccess(responseData.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 400) {
      yield put(updateBonusFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 401) {
      yield put(updateBonusFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      invalidTokenAction();
    } else {
      yield put(updateBonusFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(updateBonusFailure());
    if (error.response.data.code === 400) {
      notifyWarning(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchUpdateBonusAPI() {
  yield takeEvery(UPDATE_BONUS, updateBonusRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateBonusAPI()]);
}
