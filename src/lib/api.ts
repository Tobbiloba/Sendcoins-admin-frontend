import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";

// Create axios instance
export const api = axios.create({
  baseURL: "https://sendcoins-admin.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      store.dispatch(logout());
      // Optional: Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Helper for delay (can be useful for testing loading states)
export const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
