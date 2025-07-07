import { all, call, put, takeEvery } from "redux-saga/effects";
import { CHECK_WHITELABEL_PRESENCE } from "../../action/types";
import { checkWhiteLabelPresenceSuccess, checkWhiteLabelPresenceFailure } from "../../action";
import API from "../../../utils/api";

function* CheckWhiteLabelPresence(action) {
  try {
    const {domain} = action.payload;
    const { data } = yield API.get(
      `admin/check-whitelabel-presence?domain=${domain}`
    );

    if (data.meta.code === 200) {
      yield put(checkWhiteLabelPresenceSuccess());
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(checkWhiteLabelPresenceFailure());
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(checkWhiteLabelPresenceFailure());
  }
}

export function* watchCheckWhiteLabelPresenceAPI() {
  yield takeEvery(CHECK_WHITELABEL_PRESENCE, CheckWhiteLabelPresence);
}

export default function* rootSaga() {
  yield all([watchCheckWhiteLabelPresenceAPI()]);
}
