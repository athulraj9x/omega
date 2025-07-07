import { all, call, put, takeEvery } from "redux-saga/effects";
import { UPDATE_BETFAIR_SHARES } from "../../action/types";
import {
  updateBetfairShareSuccess,
  updateBetfairShareFailure,
} from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";
 
function* updateBetfairShareRequest(action) {
  try {
    const { data } = yield API.put(
      "admin/update-bfshare",
      action?.payload?.data
    );

    if (data.meta.code === 200) {
      yield put(updateBetfairShareSuccess(data));
      yield call(action.payload.callback, data);
      notifySuccess("betfair share Updated", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code !== 200) {
      yield put(updateBetfairShareFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    notifyDanger("share is not updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    yield put(updateBetfairShareFailure());
  }
}

export function* updateBetfairShareAPI() {
  yield takeEvery(UPDATE_BETFAIR_SHARES, updateBetfairShareRequest);
}

export default function* rootSaga() {
  yield all([updateBetfairShareAPI()]);
}
