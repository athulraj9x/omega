
import { all, put, takeEvery,call } from "redux-saga/effects";
import { LIVEEXPOSURE } from "../../action/types";
import { getLiveExposureDataSuccess, getLiveExposureFailure } from "../../action";
import API from "../../../utils/api";
import {
    invalidTokenAction,
    notifyWarning,
  } from "../../../utils/helper";

  function* getLiveExposureDataRequest (action){
    try{
        const { data } = yield API.get(`admin/liveexposure?status=${action.payload.status}&page=${action.payload.page}&perPage=${action.payload.perPage}&onlyExposure=${action.payload.onlyExposure}`);
        if(data?.meta?.code ===200){
            yield put(getLiveExposureDataSuccess(data));
            yield call(action?.payload?.callback, data);
        }else if(data?.meta?.code ===401){
            yield put(getLiveExposureFailure())
            invalidTokenAction();
        }else if (data.meta.code !== 200) {
            yield put(getLiveExposureFailure());
          }
    }catch(error){
        yield put(getLiveExposureFailure());
    }
  }
  export function* watchLiveExpsoureDataAPI(){
    yield takeEvery(LIVEEXPOSURE , getLiveExposureDataRequest)
  }
  export default function* rootSaga() {
    yield all([watchLiveExpsoureDataAPI()]);
  }
  