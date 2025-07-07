import {
  CRYPTO_PAYMENT_MANUAL_UPDATEION,
  CRYPTO_PAYMENT_MANUAL_UPDATEION_SUCCESS,
  CRYPTO_PAYMENT_MANUAL_UPDATEION_FAILURE
} from "../types";

export const cryptoPaymentManualUpdation = (payload) => ({
  type: CRYPTO_PAYMENT_MANUAL_UPDATEION,
  payload,
});

export const cryptoPaymentManualUpdationSuccess = (payload) => ({
  type: CRYPTO_PAYMENT_MANUAL_UPDATEION_SUCCESS,
  payload,
});

export const cryptoPaymentManualUpdationFailure = () => ({
  type: CRYPTO_PAYMENT_MANUAL_UPDATEION_FAILURE,
});