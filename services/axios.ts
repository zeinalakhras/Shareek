import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from '../utils/secureStore';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.shareek.app/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// 1. Request Interceptor: Add Access Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handling 401 errors and token renewal
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already attempted to refresh for this request    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
          // Request token renewal from the server
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = refreshResponse.data.data;

          // Save new tokens in SecureStore
          await setTokens(access_token, newRefreshToken);

          // Update the token in the original request and resend it
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Renewal failed (token expired or revoked) -> Log out user
        await removeTokens();
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;