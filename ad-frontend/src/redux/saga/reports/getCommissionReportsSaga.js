import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_COMMISSION_REPORTS } from "../../action/types";
import {
  getCommissionReportsSuccess,
  getCommissionReportsFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getCommissionReportsRequest(action) {
  try {
    const {
      page,
      perPage,
      month,
      year,
      buildTreeFrom,
      search,
      selectedCurrency,
      startDate,
      endDate
    } = action.payload;
    const response = yield API.get(
      `/admin/get-commission-reports?page=${page}&perPage=${perPage}&month=${month}&year=${year}&buildTreeFrom=${buildTreeFrom}&search=${search}&selectedCurrency=${selectedCurrency}&startDate=${startDate}&endDate=${endDate}`
    );

    if (response?.data?.meta?.code === 200) {
      const responseData = response.data;
      const { data, totalPages, page } = responseData;

      // Dispatch success with the data, totalPages, and current page
      yield put(getCommissionReportsSuccess({ data, totalPages, page }));

      // Call the callback function if provided
      if (action.payload.callback) {
        yield call(action.payload.callback, { data, totalPages, page });
      }
    } else if (response?.data?.meta?.code === 401) {
      yield put(getCommissionReportsFailure());
      invalidTokenAction();
    } else if (response.meta?.code !== 200) {
      yield put(getCommissionReportsFailure());
      if (action.payload.callback) {
        yield call(action.payload.callback, response);
      }
    }
  } catch (error) {
    yield put(getCommissionReportsFailure());
  }
}

export function* watchGetCommissionReportsAPI() {
  yield takeEvery(GET_COMMISSION_REPORTS, getCommissionReportsRequest);
}

export default function* rootSaga() {
  yield all([watchGetCommissionReportsAPI()]);
}
