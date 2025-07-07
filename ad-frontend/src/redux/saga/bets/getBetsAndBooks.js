import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BETS_AND_BOOKS } from "../../action/types";
import { getBetsAndBooksSuccess, getBetsAndBooksFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getBetsAndBooksRequest(action) {
  try {
    const { eventId, currentPage, perPage, currencyId, deleted ,type , horse=false, filterBetAmount} =
      action?.payload;
    const { data } = yield API.get(
      `admin/get-bets-and-books?eventId=${eventId}&currencyId=${currencyId}&del=${deleted}&type=${type}&filterBetAmount=${filterBetAmount}&horse=${horse}`
    );

    if (data.meta.code === 200) {
      yield put(getBetsAndBooksSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getBetsAndBooksFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBetsAndBooksFailure());
    }
  } catch (error) {
    yield put(getBetsAndBooksFailure());
  }
}

export function* watchGetBetsAndBooksAPI() {
  yield takeEvery(GET_BETS_AND_BOOKS, getBetsAndBooksRequest);
}

export default function* rootSaga() {
  yield all([watchGetBetsAndBooksAPI()]);
}
