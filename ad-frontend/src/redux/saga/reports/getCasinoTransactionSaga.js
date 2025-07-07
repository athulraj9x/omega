import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_CASINO_TRANSACTION } from "../../action/types";
import {
  getCasinoTransationSuccess,
  getCasinoTransationFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getCasinoTransactionRequest(action) {
  try {
    const { userId, description, page, perPage, casino_type } = action?.payload;
    const { data } = yield API.get(
      `admin/get-casino-transaction?userId=${userId}&description=${description}&page=${page}&per_page=${perPage}&casino_type=${casino_type}`
    );

    if (data.meta.code === 200) {
      yield put(getCasinoTransationSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getCasinoTransationFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getCasinoTransationFailure());
    }
  } catch (error) {
    console.log("error", error);
    yield put(getCasinoTransationFailure());
  }
}

export function* watchGetCasinoTransactionAPI() {
  yield takeEvery(
    GET_CASINO_TRANSACTION,
    getCasinoTransactionRequest
  );
}

export default function* rootSaga() {
  yield all([watchGetCasinoTransactionAPI()]);
}
