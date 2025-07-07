import { all, call, put, takeEvery } from "redux-saga/effects";
import { UPDATE_CLIENT_SHARES } from "../../action/types";
import {
  updateClientShareSuccess,
  updateClientShareFailure,
} from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* updateClientShareRequest(action) {
  try {
    const { data } = yield API.put(
      "admin/update-client-share",
      action?.payload?.data
    );

    if (data.meta.code === 200) {
      yield put(updateClientShareSuccess(data));
      yield call(action.payload.callback, data);
      notifySuccess("betfair share Updated", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code !== 200) {
      yield put(updateClientShareFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(updateClientShareFailure());
  }
}

export function* updateClientShareAPI() {
  yield takeEvery(UPDATE_CLIENT_SHARES, updateClientShareRequest);
}

export default function* rootSaga() {
  yield all([updateClientShareAPI()]);
}
