// import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";
import rootReducer from "./../reducer";
import rootSaga from "./../saga";
import { configureStore } from "@reduxjs/toolkit";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
 