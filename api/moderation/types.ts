import { ApiResponse } from "../auth/types";

export interface BlockUserRequest {
  reason?: string;
}

export type BlockUserResponse = ApiResponse<null>;

export type UnblockUserResponse = ApiResponse<null>;

export interface UserSummary {
  id: string;
  full_name: string | null;
  email: string;
  profile_image: string | null;
  created_at: string;
  /** Rendered as the orange verified check next to the user's name. */
  is_verified?: boolean;
}

export type GetBlockedUsersResponse = ApiResponse<UserSummary[]>;
