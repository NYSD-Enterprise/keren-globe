import axios from "axios";
import { getToken, clearSession } from "./auth";

// In production the app is served behind nginx, which proxies /api to the gateway.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5001");

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = /\/(login|register)$/.test(error.config?.url || "");

    if (error.response?.status === 401 && !isAuthRoute) {
      clearSession();
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default API;
