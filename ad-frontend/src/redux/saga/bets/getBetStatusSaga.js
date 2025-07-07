import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
  setLocalStorageItem,
} from "../../../utils/helper";
import {
  getBetStatusFailure,
  getBetStatusSuccess,
} from "../../action/bets/getBetStatus";
import { GET_BET_STATUS } from "../../action/types";

function* getBetStatusRequest(action) {
  try {
    const { data } = yield API.post("admin/bet-status", action?.payload?.data);
    if (data?.meta?.code === 200) {
      yield put(getBetStatusSuccess(data));
      yield call(action.payload.callback, data?.meta);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(getBetStatusFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else {
      yield put(getBetStatusFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error);
    yield put(getBetStatusFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchgetBetStatusAPI() {
  yield takeEvery(GET_BET_STATUS, getBetStatusRequest);
}

export default function* rootSaga() {
  yield all([watchgetBetStatusAPI()]);
}
