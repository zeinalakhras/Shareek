import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { getRefreshToken } from "../utils/secureStore";
import type { RefreshTokenResponse } from "./auth/types";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") || "https://api.shareek.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const NO_REFRESH_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/verify-otp",
  "/api/v1/auth/resend-otp",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/oauth",
];

const shouldSkipRefresh = (url?: string): boolean =>
  !!url && NO_REFRESH_PATHS.some((path) => url.includes(path));

const requestNewTokens = async (): Promise<string> => {
  const storedRefreshToken = await getRefreshToken();
  if (!storedRefreshToken) {
    throw new Error("No refresh token stored.");
  }

  const { data } = await axios.post<RefreshTokenResponse>(
    `${API_BASE_URL}/api/v1/auth/refresh`,
    { refresh_token: storedRefreshToken },
    { headers: { "Content-Type": "application/json" }, timeout: 15000 }
  );

  const tokens = data?.data;
  if (!tokens?.access_token) {
    throw new Error("Malformed refresh response.");
  }

  await useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);

  return tokens.access_token;
};

let inFlightRefresh: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      shouldSkipRefresh(original.url)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!inFlightRefresh) {
        inFlightRefresh = requestNewTokens().finally(() => {
          inFlightRefresh = null;
        });
      }

      const accessToken = await inFlightRefresh;
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      await useAuthStore.getState().clearSession();
      return Promise.reject(error);
    }
  }
);
