import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_CHANNEL_CODE } from "../../action/types";
import {
  updateChannelCodeSuccess,
  updateChannelCodeFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* updateChannelCodeRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-channelCode",
      action?.payload
    );
    if (data.meta.code === 200) {
      yield put(updateChannelCodeSuccess(data.data));
      yield call(action.payload.callback, data);
      toast.dismiss();

      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(updateChannelCodeFailure());
      toast.dismiss();
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(updateChannelCodeFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(updateChannelCodeFailure());
    toast.dismiss();
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchUpdateChannelCodeAPI() {
  yield takeEvery(UPDATE_CHANNEL_CODE, updateChannelCodeRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateChannelCodeAPI()]);
}
