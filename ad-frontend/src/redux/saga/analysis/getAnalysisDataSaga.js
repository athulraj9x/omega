import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_ANALYSIS_DATAS } from "../../action/types";
import { getAnalysisDataSuccess, getAnalysisDataFailure } from "../../action";
import API from "../../../utils/api";
import { removeLocalStorageItem } from "../../../utils/helper";

function* getAnalysisDataRequest(action) {
  try {
    const { sportId, leagueId, eventId, type ,horse=false,venueId=null} = action?.payload;
    const { data } = yield API.get(
      `admin/market-analysis?sportId=${sportId}&leagueId=${leagueId}&eventId=${eventId}&type=${type}&horse=${horse}&venueId=${venueId}`
    );
    if (data.meta.code === 200) {
      yield put(getAnalysisDataSuccess(data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(getAnalysisDataFailure());
      removeLocalStorageItem("token");
    } else if (data.meta.code !== 200) {
      yield put(getAnalysisDataFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getAnalysisDataFailure());
  }
}

export function* watchAnalysisAPI() {
  yield takeEvery(GET_ANALYSIS_DATAS, getAnalysisDataRequest);
}

export default function* rootSaga() {
  yield all([watchAnalysisAPI()]);
}
