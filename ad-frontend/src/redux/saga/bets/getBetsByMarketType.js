import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BET_BY_MARKETTYPE } from "../../action/types";
import {
  getBetByMarketTypeSuccess,
  getBetByMarketTypeFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getBetByMArketTypeRequest(action) {
  try {
    const { marketType, eventId, currentPage, perPage } = action?.payload;
    const { data } = yield API.get(
      `admin/get-bet-by-marketType?marketType=${marketType}&eventId=${eventId}&per_page=${perPage}&page=${currentPage}`
    );
    if (data.meta.code === 200) {
      yield put(getBetByMarketTypeSuccess(data?.data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getBetByMarketTypeFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else if (data.meta.code !== 200) {
      yield put(getBetByMarketTypeFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getBetByMarketTypeFailure());
  }
}

export function* watchGetBetByMarketTypeAPI() {
  yield takeEvery(GET_BET_BY_MARKETTYPE, getBetByMArketTypeRequest);
}

export default function* rootSaga() {
  yield all([watchGetBetByMarketTypeAPI()]);
}
