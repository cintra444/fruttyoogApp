import axios from "axios";

export const api = axios.create({
  baseURL: "https://192.168.18.249:8081",
});