import axios from "axios";
import { settings } from "../config/settings";

const API_BASE_URL = settings.apiBase;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: handle 401 error for your application
    }
    return Promise.reject(error);
  }
);

export default api;
