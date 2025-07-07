import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";
import {
  getDeletedBetFailure,
  getDeletedBetSuccess,
} from "../../action/bets/getDeletedBets";
import { GET_DELETED_BETS } from "../../action/types";

function* getDeletedBetsRequest(action) {
  try {
    const { category, filter, startDate, endDate, isChecked } =
      action?.payload?.data;
    const { data } = yield API.get(
      `admin/invalid-void-bets?filter=${filter}&category=${category}&start_date=${startDate}&end_date=${endDate}&isChecked=${isChecked}`
    );
    if (data?.meta?.code === 200) {
      yield put(getDeletedBetSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getDeletedBetFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else {
      yield put(getDeletedBetFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error);
    yield put(getDeletedBetFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchgetDeletedBetsAPI() {
  yield takeEvery(GET_DELETED_BETS, getDeletedBetsRequest);
}

export default function* rootSaga() {
  yield all([watchgetDeletedBetsAPI()]);
}
