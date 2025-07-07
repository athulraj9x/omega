import { all, call, put, takeEvery } from "redux-saga/effects";
import { CLIENT_SETTLEMENT } from "../../action/types";
import { clientSettlementSuccess, clientSettlementFailure } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifyWarning,
} from "../../../utils/helper";

function* clientSettlementRequest(action) {
  try {
    let data = null;
    if (action.payload.review === true) {
      const { review, ...restPayload } = action.payload;
      if (review === true) {
        const response = yield API.post(
          "admin/client-settlement-preview",
          restPayload
        );
        data = response.data;
      }
    } else {
      const response = yield API.put(
        "admin/client-settlement",
        action?.payload
      );
      data = response.data;
    }

    if (data.meta.code === 200) {
      yield put(clientSettlementSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(clientSettlementFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    // notifyDanger("share is not updated", {
    //   position: toast.POSITION.BOTTOM_CENTER,
    // });
    yield put(clientSettlementFailure());
  }
}

export function* clientSettlementAPI() {
  yield takeEvery(CLIENT_SETTLEMENT, clientSettlementRequest);
}

export default function* rootSaga() {
  yield all([clientSettlementAPI()]);
}