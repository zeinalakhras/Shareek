import { api } from "../axiosInstance";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetCurrentUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  OAuthRequest,
  OAuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
} from "./types";

const createIdempotencyKey = (): string => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const register = async (
  body: RegisterRequest,
  idempotencyKey: string = createIdempotencyKey()
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>(
    "/api/v1/auth/register",
    body,
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return res.data;
};

export const login = async (
  body: LoginRequest
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>(
    "/api/v1/auth/login",
    body
  );

  return res.data;
};

export const verifyResetOtp = async (
  body: VerifyResetOtpRequest
): Promise<VerifyResetOtpResponse> => {
  const res = await api.post<VerifyResetOtpResponse>(
    "/api/v1/auth/verify-reset-otp",
    body
  );

  return res.data;
};

export const verifyOtp = async (
  body: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const res = await api.post<VerifyOtpResponse>(
    "/api/v1/auth/verify-otp",
    body
  );

  return res.data;
};

export const resendOtp = async (
  body: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const res = await api.post<ResendOtpResponse>(
    "/api/v1/auth/resend-otp",
    body
  );

  return res.data;
};

export const refreshToken = async (
  body: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const res = await api.post<RefreshTokenResponse>(
    "/api/v1/auth/refresh",
    body
  );

  return res.data;
};

export const forgotPassword = async (
  body: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const res = await api.post<ForgotPasswordResponse>(
    "/api/v1/auth/forgot-password",
    body
  );

  return res.data;
};

export const resetPassword = async (
  body: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const res = await api.post<ResetPasswordResponse>(
    "/api/v1/auth/reset-password",
    body
  );

  return res.data;
};


export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const res = await api.get<GetCurrentUserResponse>("/api/v1/auth/me");

  return res.data;
};

export const logout = async (
  body: LogoutRequest
): Promise<LogoutResponse> => {
  const res = await api.post<LogoutResponse>(
    "/api/v1/auth/logout",
    body
  );

  return res.data;
};

export const oauthLogin = async (
  body: OAuthRequest
): Promise<OAuthResponse> => {
  const res = await api.post<OAuthResponse>(
    "/api/v1/auth/oauth",
    body
  );

  return res.data;
};