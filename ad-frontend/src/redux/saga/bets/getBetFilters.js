import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifyWarning,
} from "../../../utils/helper";
import {
  getbetFiltersFailure,
  getbetFiltersSuccess,
} from "../../action/bets/getBetFilters";
import { GET_BET_FILTER } from "../../action/types";

function* getBetFiltersRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/bet-filters?filter=${action.payload.data}`
    );
    if (data?.meta?.code === 200) {
      yield put(getbetFiltersSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getbetFiltersFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else {
      yield put(getbetFiltersFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error);
    yield put(getbetFiltersFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchgetBetFiltersAPI() {
  yield takeEvery(GET_BET_FILTER, getBetFiltersRequest);
}

export default function* rootSaga() {
  yield all([watchgetBetFiltersAPI()]);
}
