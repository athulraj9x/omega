import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_SETTLEMENT } from "../../action/types";
import { getSettlementSuccess, getSettlementFailure } from "../../action";
import API from "../../../utils/api";
import { notifyDanger, notifyWarning } from "../../../utils/helper";

function* getSettlementRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/user-settlement?userId=${action.payload.userId}`
    );

    if (data?.meta?.code === 200) {
      yield put(getSettlementSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else if (data?.meta?.code === 400) {
      yield put(getSettlementFailure());
    }
  } catch (error) {
    yield put(getSettlementFailure());
    if (error?.response?.data?.code === 400) {
      notifyWarning(error?.response?.data?.message, {position: toast.POSITION.BOTTOM_CENTER});
    } else {
      notifyDanger("Internal Server Error.", {position: toast.POSITION.BOTTOM_CENTER});
    }
  }
}

export function* watchGetSettlementAPI() {
  yield takeEvery(GET_SETTLEMENT, getSettlementRequest);
}

export default function* rootSaga() {
  yield all([watchGetSettlementAPI()]);
}
