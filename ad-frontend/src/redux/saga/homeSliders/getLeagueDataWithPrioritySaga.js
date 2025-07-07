import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_LEAGUE_DATA_WITH_PRIORITY } from "../../action/types";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";
import { getLeagueDataWithPriorityFailure, getLeagueDataWithPrioritySuccess } from "../../action";

function* getLeagueDataWithPriorityAPI(action) {
  try {
    const { data } = yield API.get(`admin/sport-leagues-home/${action.payload.data}`);
    if (data?.meta?.code === 200) {
      yield put(getLeagueDataWithPrioritySuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(getLeagueDataWithPriorityFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(getLeagueDataWithPriorityFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchLeagueDataWithPriorityAPI() {
  yield takeEvery(GET_LEAGUE_DATA_WITH_PRIORITY, getLeagueDataWithPriorityAPI);
}

export default function* rootSaga() {
  yield all([watchLeagueDataWithPriorityAPI()]);
}
