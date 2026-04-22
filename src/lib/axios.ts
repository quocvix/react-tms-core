import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10_000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Gắn access token vào header Authorization trước mỗi request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Nếu token hết hạn (401/403) → xóa auth state
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            useAuthStore.getState().clearState();
        }
        return Promise.reject(error);
    },
);

export default api;
