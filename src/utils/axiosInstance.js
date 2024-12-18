import axios from "axios";
import { API_ENDPOINT } from "../constants/api";

const apiClient = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});
  console.log("🚀 ~ API_ENDPOINT:", API_ENDPOINT)

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
