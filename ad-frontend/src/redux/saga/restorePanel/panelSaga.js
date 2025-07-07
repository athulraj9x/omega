import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_PANEL } from "../../action/types";
import {
  addPanelFailure,
  addPanelSuccess,
} from "../../action/restorePanel/panelAction";
import API from "../../../utils/oddApi";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addPanelRequest(action) {
  try {
    const { data } = yield API.post(
      "api/v2/exchange-book",
      action?.payload?.formData
    );
    if (data.meta.code === 200) {
      yield put(addPanelSuccess(data.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message);
    } else if (data.meta.code === 400) {
      yield put(addPanelFailure());
      notifyWarning(data.meta.message);
      yield call(action.payload.callback, data);
      invalidTokenAction();
    } else if (data.meta.code === 401) {
      yield put(addPanelFailure());
      notifyWarning(data.meta.message);
      yield call(action.payload.callback, data);
    }else {
      yield put(addPanelFailure());
      notifyWarning(data.meta.message);
    }
  } catch (error) {
    yield put(addPanelFailure());
    if (error.response.data.code === 400) {
      yield put(addPanelFailure());
      notifyWarning(error.response.data.message);
      yield call(action.payload.callback, "");
    } else {
      yield put(addPanelFailure());
      notifyDanger("Internal Server Error.");
    }
  }
}

export function* watchAddPanelAPI() {
  yield takeEvery(ADD_PANEL, addPanelRequest);
}

export default function* rootSaga() {
  yield all([watchAddPanelAPI()]);
}
