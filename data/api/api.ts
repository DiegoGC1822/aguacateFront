import axios from "axios";
import { refreshToken } from "../services/authService";
import { useAuth } from "../../presentation/viewmodel/useAuth";

const api = axios.create({
  baseURL: "https://avoclassifier-api.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login/") ||
      originalRequest.url?.includes("/auth/register/") ||
      originalRequest.url?.includes("/auth/refresh/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        const storedRefresh = useAuth.getState().tokenRefresh;

        if (!storedRefresh) throw new Error("No refresh token");

        const { access, refresh } = await refreshToken(storedRefresh);

        useAuth.setState({
          token: access,
          tokenRefresh: refresh,
        });

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuth.setState({
          token: null,
          tokenRefresh: null,
          isAuthenticated: false,
          profile: null,
        });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
