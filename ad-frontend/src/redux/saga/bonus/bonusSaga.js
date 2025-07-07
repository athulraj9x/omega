import { all, call, put, takeEvery } from "redux-saga/effects";
import { BONUS, GET_BONUS } from "../../action/types";
import { bonusFailure, bonusSuccess, getBonusSuccess, getBonusFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* bonusRequest(action) {
    try {
        const { data } = yield API.post(
            `admin/addEditBonus`, action.payload?.form
        );
        if (data.meta.code === 200) {
            yield put(bonusSuccess(data));
            yield call(action.payload.callback, data);
        } else if (data.meta.code === 401) {
            yield put(bonusFailure());
            invalidTokenAction();
        } else if (data.meta.code !== 200) {
            yield put(bonusFailure());
        }
    } catch (error) {
        yield put(bonusFailure());
    }
}

function* getBonusRequest() {
    try {
        const { data } = yield API.get(
            `admin/getBonus`
        );
        if (data.meta.code === 200) {
            yield put(getBonusSuccess(data));
        } else if (data.meta.code === 401) {
            yield put(getBonusFailure());
            invalidTokenAction();
        } else if (data.meta.code !== 200) {
            yield put(getBonusFailure());
        }
    } catch (error) {
        yield put(getBonusFailure());
    }
}

export function* watchGetBonus() {
    yield takeEvery(BONUS, bonusRequest);
}

export function* watchAddEditBonus() {
    yield takeEvery(GET_BONUS, getBonusRequest);
}

export default function* rootSaga() {
    yield all([watchAddEditBonus(), watchGetBonus()]);
}
