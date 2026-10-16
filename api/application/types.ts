import { ApiResponse } from "../auth/types";
import { PaginationResponse } from "../notification/types";

export interface CreateApplicationRequest {
  projectId: string;
  roleId: string;
  message: string;
}

export interface Application {
  id: string;
  userId: string;
  applicantName: string;
  projectId: string;
  projectName: string;
  roleId: string;
  roleName: string;
  status: string;
  message: string;
  appliedAt: string;
  reviewerId: string | null;
  reviewedAt: string | null;
}

export interface GetApplicationsParams {
  project_id?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ApplicationStatusUpdateRequest {
  status: string;
  reason: string;
}

export type CreateApplicationResponse = ApiResponse<Application>;

export type GetApplicationsResponse = ApiResponse<
  PaginationResponse<Application>
>;

export type GetApplicationResponse = ApiResponse<Application>;

export type UpdateApplicationStatusResponse =
  ApiResponse<Application>;

export type DeleteApplicationResponse = ApiResponse<null>;
    