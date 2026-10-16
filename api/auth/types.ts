
import type { University } from "../university/types";
import type { Skill } from "../skill/types";
import type { Role } from "../role/types";

export interface ApiResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
}

export interface CredentialsRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  isStudent: boolean;
  email: string;
  password: string;
}

export type LoginRequest = CredentialsRequest;

export interface AuthUser {
  id: string;
  full_name: string | null;
  email: string;
  profile_image: string | null;
  created_at: string;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthData extends TokenData {
  user: AuthUser;
}

export type RegisterResponse = ApiResponse<null>;

export type LoginResponse = ApiResponse<AuthData>;

export interface OAuthRequest {
  provider: string;
  token: string;
}

export type OAuthResponse = ApiResponse<AuthData>;

export interface RefreshTokenRequest {
  refresh_token: string;
}

export type RefreshTokenResponse = ApiResponse<TokenData>;

// Logout
export type LogoutRequest = RefreshTokenRequest;
export type LogoutResponse = ApiResponse<null>;


export interface EmailRequest {
  email: string;
}

export interface VerifyOtpRequest extends EmailRequest {
  otp: string;
}

/** Email verification for a new account. Carries a session, exactly like login. */
export type VerifyOtpData = AuthData;

export type VerifyOtpResponse = ApiResponse<VerifyOtpData>;

export interface VerifyResetOtpRequest extends EmailRequest {
  otp: string;
}

export interface VerifyResetOtpData {
  "reset-token": string | null;
  expires_in: number;
}

export type VerifyResetOtpResponse = ApiResponse<VerifyResetOtpData>;

export interface ResendOtpData {
  email: string;
  expires_in: number;
}

export type ResendOtpResponse = ApiResponse<ResendOtpData>;
export type ResendOtpRequest = EmailRequest;


export type ForgotPasswordRequest = EmailRequest;

export interface ForgotPasswordData {
  email: string;
  expires_in: number;
}

export type ForgotPasswordResponse = ApiResponse<ForgotPasswordData>;

export interface ResetPasswordRequest {
  reset_token: string;
  new_password: string;
}

export interface ResetPasswordData {
  email: string;
}

export type ResetPasswordResponse = ApiResponse<ResetPasswordData>;


export interface UserStats {
  projects_created: number;
  projects_joined: number;
  applications_sent: number;
  applications_received: number;
  stars_received: number;
  member_since: string;
}

export interface CurrentUser {
  id: string;
  full_name: string | null;
  email: string;
  bio: string | null;
  profile_image: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  /** Admin-set Telegram handle — read-only, never written from the client. */
  telegram_username: string | null;
  is_student: boolean;
  university: University | null;
  major: string | null;
  study_year: number | null;
  available_hours_per_week: number | null;
  work_preference: string | null;
  project_preference: string | null;
  is_verified: boolean;
  skills: Skill[];
  roles: Role[];
  stats: UserStats;
  JoinedDate: string;
}

export type GetCurrentUserResponse = ApiResponse<CurrentUser>;