import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { CLIENT_SETTLEMENT_COMPLETED_UPDATION } from "../../action/types";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";
import {
  clientSettilementCompleteUpdationFailure,
  clientSettilementCompleteUpdationSuccess,
} from "../../action";

function* clientSettlementCompletedUpdation(action) {
  try {
    const { data } = yield API.post(
      "/admin/client-settlement-completed-updation",
      action.payload.data
    );
  
    if (data.meta.code === 200) {
      yield put(clientSettilementCompleteUpdationSuccess(data.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });

    } else if (data.meta.code === 401) {
      // yield put(clientSettilementCompleteUpdationFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data);
      yield put(clientSettilementCompleteUpdationSuccess("success"));
      return;
    } else if (data.meta.code !== 400) {
      yield put(clientSettilementCompleteUpdationFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(clientSettilementCompleteUpdationFailure());
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

export function* watchSettlementCompletedUpdationAPI() {
  yield takeEvery(
    CLIENT_SETTLEMENT_COMPLETED_UPDATION,
    clientSettlementCompletedUpdation
  );
}

export default function* rootSaga() {
  yield all([watchSettlementCompletedUpdationAPI()]);
}
