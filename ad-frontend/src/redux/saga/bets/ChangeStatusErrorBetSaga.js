import { all, call, put, takeEvery } from "redux-saga/effects";
import { CHANGE_ERROR_BETS } from "../../action/types";
import { ChangeStatusErrorBetFailure, ChangeStatusErrorBetSuccess } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* changeErrorBetRequest(action) {
    try {
        const { data } = yield API.get(
            `admin/changestatus-errorbets/${action.payload?.id}`
        );
        if (data.meta.code === 200) {
            yield put(ChangeStatusErrorBetSuccess(data));
            yield call(action.payload.callback, data);
        } else if (data.meta.code === 401) {
            yield put(ChangeStatusErrorBetFailure());
            invalidTokenAction();
        } else if (data.meta.code !== 200) {
            yield put(ChangeStatusErrorBetFailure());
        }
    } catch (error) {
        yield put(ChangeStatusErrorBetFailure());
    }
}

export function* watchChangeBetStatusError() {
    yield takeEvery(CHANGE_ERROR_BETS, changeErrorBetRequest);
}

export default function* rootSaga() {
    yield all([watchChangeBetStatusError()]);
}
