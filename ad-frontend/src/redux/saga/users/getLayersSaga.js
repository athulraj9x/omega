import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_LAYERS } from "../../action/types";
import { getLayersSuccess, getLayersFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getLayersRequest(action) {
  try {
    const { page, perPage, buildTreeFrom, search, selectedCurrency, userType, selectedSorting } = action.payload;

    let allUsers = false;
    if (action.payload.allUsers) {
      allUsers = true;
    }


    
    const { data } = yield API.get(`/admin/getusers?buildTreeFrom=${buildTreeFrom}&selectedSorting=${selectedSorting}&page=${page}&perPage=${perPage}&selectedCurrency=${selectedCurrency}&userType=${userType}&search=${search}&allUsers=${allUsers}`);
    if (data.meta.code === 200) {
      yield put(getLayersSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getLayersFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getLayersFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(getLayersFailure());
  }
}

export function* watchLayersAPI() {
  yield takeEvery(GET_LAYERS, getLayersRequest);
}

export default function* rootSaga() {
  yield all([watchLayersAPI()]);
}
