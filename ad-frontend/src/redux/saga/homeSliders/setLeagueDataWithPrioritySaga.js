import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { SET_LEAGUE_DATA_WITH_PRIORITY } from "../../action/types";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";
import { setLeaguePriorityFailure, setLeaguePrioritySuccess } from "../../action";

function* setLeagueDataWithPriorityAPI(action) {
  try {
    const { data } = yield API.post("admin/sport-leagues-home",action.payload.data);
    if (data?.meta?.code === 200) {
      yield put(setLeaguePrioritySuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(setLeaguePriorityFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(setLeaguePriorityFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchSetLeagueDataWithPriorityAPI() {
  yield takeEvery(SET_LEAGUE_DATA_WITH_PRIORITY, setLeagueDataWithPriorityAPI);
}

export default function* rootSaga() {
  yield all([watchSetLeagueDataWithPriorityAPI()]);
}
