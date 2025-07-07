import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_USERBETS_EVENT } from "../../action/types";
import { getUserBetsEventSuccess, getUserBetsEventFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getUserBetsByEvent(action) {
  try {
    const { userId, marketId, isBonus } = action?.payload?.data;
    const { data } = yield API.get(
      `admin/get-userbets-by-market?marketId=${marketId}&userId=${userId}&isBonus=${isBonus}`
    );
    if (data.meta.code === 200) {
      yield put(getUserBetsEventSuccess(data?.data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getUserBetsEventFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else if (data.meta.code !== 200) {
      yield put(getUserBetsEventFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getUserBetsEventFailure());
  }
}

export function* watchGetUserBetsByEventAPI() {
  yield takeEvery(GET_USERBETS_EVENT, getUserBetsByEvent);
}

export default function* rootSaga() {
  yield all([watchGetUserBetsByEventAPI()]);
}
