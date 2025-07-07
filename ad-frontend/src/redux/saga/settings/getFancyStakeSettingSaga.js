import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_FANCY_STAKE_LIMIT } from "../../action/types";
import { getFancyStakeLimitSuccess, getFancyStakeLimitFailure } from "../../action";
import API from "../../../utils/api";

function* getFancyStakeLimitRequest(action) {
    try {
        const { data } = yield API.post(
            `admin/fancy-stake-settings`,
            action?.payload
        );
        if (data?.meta.code === 200) {
            yield put(getFancyStakeLimitSuccess(data?.data));
            yield call(action.payload.callback, data);
        } else if (data?.meta?.code !== 200) {
            yield put(getFancyStakeLimitFailure());
        }
    } catch (error) {
        yield put(getFancyStakeLimitFailure);
    }
}
export function* watchGetFancyStakeSettingAPI() {
    yield takeEvery(GET_FANCY_STAKE_LIMIT, getFancyStakeLimitRequest);
};

export default function* rootSaga() {
    yield all([watchGetFancyStakeSettingAPI()])
}
