import axios from "axios";
import { url, getLocalStorageItem } from "./helper";

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${getLocalStorageItem("token")}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  function (error) {
    console.log(error, "error");
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
