import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { DELETE_BANK_DETAILS } from "../../action/types";
import {
    deleteBankDetailsActionSuccess,
    deleteBankDetailsActionFailure
} from '../../action';
import API from '../../../utils/api';
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* deleleBankDataRequest(action) {
    try {
        const { data } = yield API.delete(`admin/delete-bank/${action.payload.data?.id}`);
        if (data?.meta?.code === 200) {
            yield put(deleteBankDetailsActionSuccess(data))
            yield call(action.payload.callback, data)
            notifySuccess(data?.meta?.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            });
        } else {
            yield put(deleteBankDetailsActionFailure(data?.data));
            yield call(action.payload.callback, data);
            notifyDanger("Internal Server Error.", {
                position: toast.POSITION.BOTTOM_CENTER,
            });
        }
    } catch (error) {
        console.log(error)
        yield put(deleteBankDetailsActionFailure())
        notifyDanger("Internal Server Error.", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    }
}

export function* watchDeleteBankDetailsAPI() {
    yield takeEvery(DELETE_BANK_DETAILS, deleleBankDataRequest)
}

export default function* rootSaga() {
    yield all([watchDeleteBankDetailsAPI()])
}