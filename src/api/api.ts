import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "https://192.168.18.249:8081",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;