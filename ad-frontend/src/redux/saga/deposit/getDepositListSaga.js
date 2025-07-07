import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_DEPOSITLIST } from "../../action/types";
import { toast } from "react-toastify";
import { getDepositListSuccess, getDepositListFailure } from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* getDepositListRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/deposit-list?status=${action?.payload?.data}&page=${action.payload.page}&perPage=${action.payload.perPage}`
    ); 
    if (data?.meta?.code === 200) {
      yield put(getDepositListSuccess(data));
      yield call(action?.payload?.callback, data);
      // notifySuccess(data?.meta?.message, {
      //   position: toast.POSITION.BOTTOM_CENTER,
      // });
    } else if (data?.meta?.code === 401) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action?.payload?.callback, data);
      yield put(getDepositListFailure());
      invalidTokenAction();
    } else if (data?.code === 400) {
      yield put(getDepositListFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(getDepositListFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(getDepositListFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDepositListRequest() {
  yield takeEvery(GET_DEPOSITLIST, getDepositListRequest);
}

export default function* rootSaga() {
  yield all([watchDepositListRequest()]);
}
