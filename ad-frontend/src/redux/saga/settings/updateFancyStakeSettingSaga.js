import { all, call, put, takeEvery } from "redux-saga/effects";
import { UPDATE_FANCY_STAKE_LIMIT } from "../../action/types";
import {
  updateFancyStakeLimitSuccess,
  updateFancyStakeLimitFailure,
} from "../../action";
import API from "../../../utils/api";

function* updateFancyStakeLimitRequest(action){
    try{
        const { data } = yield API.post(
            `admin/update-fancy-stakelimit`,
            action?.payload
        );
        if(data?.meta?.code ==200){
            yield put(updateFancyStakeLimitSuccess(data?.data));
            yield call (action?.payload?.callback , data);
        }else if(data?.meta?.code!==200){
            yield put(updateFancyStakeLimitFailure());
        }
    }catch(error){
        yield put(updateFancyStakeLimitFailure);
    }
}
export function* watchUpdateFancyStakeSettingAPI(){
    yield takeEvery(UPDATE_FANCY_STAKE_LIMIT , updateFancyStakeLimitRequest)
};

export default function* rootSaga(){
    yield all([watchUpdateFancyStakeSettingAPI()])
}