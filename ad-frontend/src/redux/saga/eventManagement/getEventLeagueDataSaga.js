import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { GET_LEAGUE_EVENT_DATA } from "../../action/types";
import { getLeagueEventDataFailure, getLeagueEventDataSuccess } from "../../action";
import { notifyWarning } from "../../../utils/helper";

function* getLeagueEventDataRequest(action) {
  try {
    const { data } = yield API.get(
      `/admin/get-league-event-data?sportId=${action.payload?.data?.id}&page=${action.payload?.data?.currentPage}&sportsCode=${action?.payload?.data?.sportsCode}`
    );
    if (data.meta.code === 200) {
      yield put(getLeagueEventDataSuccess(data));
      yield call(action.payload.callback, data?.data?.sportsData);
      if(data?.data?.sportsData === null && data?.data?.count ===0){

        notifyWarning(data?.data?.message)
      }
    } else if (data.meta.code === 401) {
      yield put(getLeagueEventDataFailure());
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    } else if (data.meta.code !== 200) {
      yield put(getLeagueEventDataFailure());
    }
  } catch (error) {
    yield put(getLeagueEventDataFailure());
  }
}

export function* watchGetLeagueEventDataAPI() {
  yield takeEvery(GET_LEAGUE_EVENT_DATA, getLeagueEventDataRequest);
}

export default function* rootSaga() {
  yield all([watchGetLeagueEventDataAPI()]);
}
