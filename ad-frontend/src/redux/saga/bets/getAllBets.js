import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_ALLBETS } from "../../action/types";
import { getAllBetsSuccess, getAllBetsFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getAllBetsRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/my-market-data?type=${action?.payload?.type}`
    );
    if (data.meta.code === 200) {
      yield put(getAllBetsSuccess(data?.data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getAllBetsFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getAllBetsFailure());
    }
  } catch (error) {
    yield put(getAllBetsFailure());
  }
}

export function* watchGetAllBetsAPI() {
  yield takeEvery(GET_ALLBETS, getAllBetsRequest);
}

export default function* rootSaga() {
  yield all([watchGetAllBetsAPI()]);
}
