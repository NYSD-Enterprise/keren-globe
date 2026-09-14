import axios from "axios";

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

export default API;
