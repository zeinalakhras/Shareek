import { ApiResponse } from "@/types/types";
import { CurrentUser, UserStats } from "../auth/types";
import type { ProjectSummary } from "../project/types";

export type GetUserResponse = ApiResponse<CurrentUser>;

export type GetUserProjectsResponse = ApiResponse<ProjectSummary[]>;

export interface UpdateUserRequest {
  full_name?: string;
  bio?: string;
  phone?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}
export type UpdateUserResponse = ApiResponse<UserDetail>
;
export interface Skill {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  website: string;
}
export interface UserDetail {
  id: string;
  full_name: string | null;
  email: string;
  bio: string | null;
  profile_image: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
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
  stats: UserStats | null;
}

export interface UpdatePreferencesRequest {
  work_preference?: string;
  project_preference?: string;
  available_hours_per_week?: number;
}

export type UpdatePreferencesResponse = ApiResponse<UserDetail>;

export interface UpdateEducationRequest {
  is_student?: boolean;
  university_id?: string;
  major?: string;
  study_year?: number;
}

export type UpdateEducationResponse = ApiResponse<UserDetail>;

export interface SyncSkillsRequest {
  skill_ids: string[];
}

export type SyncSkillsResponse = ApiResponse<UserDetail>;

export interface SyncRolesRequest {
  role_ids: string[];
}

export type SyncRolesResponse = ApiResponse<UserDetail>;

export type UploadAvatarResponse = ApiResponse<UserDetail>;
