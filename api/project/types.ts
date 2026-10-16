import { ApiResponse } from "../auth/types";
import { UserSummary } from "../moderation/types";
import { PaginationResponse } from "../notification/types";

export interface CreateProjectRequest {
  name: string;
  description: string;
  visibility: string;
}

export interface ProjectRole {
  roleId: string;
  roleName: string;
  requiredCount: number | null;
  filledCount: number | null;
  description: string | null;
  requirements: ProjectRoleRequirement[];
}
export interface ProjectRoleRequirement {
  id: string;
  projectRoleId: string;
  skillId: string;
  skillName: string;
  isRequired: boolean;
  minProficiencyLevel: number | null;
}

export interface ProjectMember {
  userId: string;
  user: UserSummary | null;
  role: string | null;
  functionalRoleId: string | null;
  functionalRoleName: string | null;
  membershipStatus: string | null;
  joinedAt: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  status: string;
  visibility: string;
  creatorId: string;
  creator: UserSummary | null;
  maxMembers: number | null;
  requiredTeamSize: number | null;
  roles: ProjectRole[];
  members: ProjectMember[];
  publishedAt: string | null;
  preparationEndsAt: string | null;
  manualStartWindowEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectResponse = ApiResponse<Project>;

/**
 * Optional: the controller accepts a missing body, and only uses `projectRoleId`
 * to seat the creator as owner. Without it the backend derives the seat itself.
 */
export interface PublishBody {
  projectRoleId?: string;
}

export interface CancelBody {
  reason: string;
}

export interface GetProjectsParams {
  q?: string;
  status?: string[];
  page?: number;
  per_page?: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  creatorId: string;
  creatorName: string | null;
  status: string;
  visibility: string;
  starCount: number | null;
  matchPercentage: number | null;
  /**
   * Roles the project is hiring for — populated by the feed/search endpoints
   * (one batched backend query). Absent on endpoints that don't fill it, so
   * consumers must treat it as optional.
   */
  roleNames?: string[];
}

export type PublishProjectResponse = ApiResponse<Project>;

export type StartProjectResponse = ApiResponse<Project>;

export type CancelProjectResponse = ApiResponse<Project>;

export type GetProjectsResponse = ApiResponse<
  PaginationResponse<ProjectSummary>
>;

export type GetProjectFeedResponse = ApiResponse<ProjectSummary[]>;

export interface GetMyProjectsParams {
  role?: string;
  status?: string[];
  page?: number;
  per_page?: number;
}

export interface MyStanding {
  membership_status: string;
  role: string;
  starred: boolean;
}
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  visibility?: string;
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  maxMembers?: number;
  requiredTeamSize?: number;
}

export type GetProjectResponse = ApiResponse<Project>;

export type GetMyProjectsResponse = ApiResponse<
  PaginationResponse<ProjectSummary>
>;

export type UpdateProjectResponse = ApiResponse<Project>;

export type UploadProjectAvatarResponse = ApiResponse<Project>;

export type GetProjectMembersResponse = ApiResponse<ProjectMember[]>;

export type StarProjectResponse = ApiResponse<null>;

export type UnstarProjectResponse = ApiResponse<null>;

export interface CreateProjectRoleRequest {
  roleId: string;
  requiredCount: number;
  description: string;
}

export interface AddRoleRequirementRequest {
  skillId: string;
  isRequired: boolean;
  minProficiencyLevel: number;
}

export type CreateProjectRoleResponse = ApiResponse<ProjectRole>;

export type GetProjectRolesResponse = ApiResponse<ProjectRole[]>;

export type UpdateProjectRoleResponse = ApiResponse<ProjectRole>;

export type DeleteProjectRoleResponse = ApiResponse<null>;

export type AddRoleRequirementResponse = ApiResponse<ProjectRoleRequirement>;

export type GetRoleRequirementsResponse = ApiResponse<ProjectRoleRequirement[]>;

export type DeleteRoleRequirementResponse = ApiResponse<null>;

export interface CreateCompletionRequest {
  resultLink: string;
  additionalLinks: string[];
  accomplished: string;
  notAccomplished: string;
}

export interface CompletionRequest {
  id: string;
  projectId: string;
  state: string;
  requestedBy: string;
  resultLink: string | null;
  additionalLinks: string[];
  accomplished: string | null;
  notAccomplished: string | null;
  reviewReason: string | null;
  reviewedAt: string | null;
}

export type CreateCompletionResponse = ApiResponse<CompletionRequest>;

export type RemoveProjectMemberResponse = ApiResponse<null>;

/** Mirrors `WithdrawalRequestDTO`; a member leaves by *requesting* it (§7). */
export interface WithdrawalRequestDTO {
  projectId: string;
  reason: string | null;
  decidedAt: string | null;
}

export type RequestWithdrawalResponse = ApiResponse<WithdrawalRequestDTO>;
