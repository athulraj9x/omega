import { all, call, put, takeEvery } from "redux-saga/effects";
import { DEPOSIT_LIST_FILTER } from "../../action/types";
import { toast } from "react-toastify";
import { depositListFilterActionSuccess,depositListFilterActionFailure } from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* depositListFilterRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/deposit-form/filter/${action?.payload?.data}`
    ); 
    if (data?.meta?.code === 200) {
      yield put(depositListFilterActionSuccess(data));
      yield call(action?.payload?.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 401) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action?.payload?.callback, data);
      yield put(depositListFilterActionFailure());
      invalidTokenAction();
    } else if (data?.code === 400) {
      yield put(depositListFilterActionFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(depositListFilterActionFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(depositListFilterActionFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDepositFilterRequestAPI() {
  yield takeEvery(DEPOSIT_LIST_FILTER, depositListFilterRequest);
}

export default function* rootSaga() {
  yield all([watchDepositFilterRequestAPI()]);
}
