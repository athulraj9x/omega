import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_WHITELABEL } from "../../action/types";
import {
  addWhiteLabelFailure,
  addWhiteLabelSuccess,
} from "../../action/whiteLabel/addWhiteLabelAction";
import API from "../../../utils/api";
import { notifySuccess, notifyWarning } from "../../../utils/helper";

function* addWhiteLabelRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/add-white-label",
      action.payload.data
    );
    if (data?.meta?.code === 200) {
      yield put(addWhiteLabelSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addWhiteLabelFailure(data?.data));
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(addWhiteLabelFailure());
    yield call(action.payload.callback, error.response);
    notifyWarning("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddWhiteLabelAPI() {
  yield takeEvery(ADD_WHITELABEL, addWhiteLabelRequest);
}

export default function* rootSaga() {
  yield all([watchAddWhiteLabelAPI()]);
}
