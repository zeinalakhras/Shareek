import { api } from "../axiosInstance";
import {
  AddRoleRequirementRequest,
  AddRoleRequirementResponse,
  CreateProjectRoleRequest,
  CreateProjectRoleResponse,
  DeleteProjectRoleResponse,
  DeleteRoleRequirementResponse,
  GetProjectRolesResponse,
  GetRoleRequirementsResponse,
  UpdateProjectRoleResponse,
} from "./types";

export const createProjectRole = async (
  projectId: string,
  accessToken: string,
  body: CreateProjectRoleRequest
): Promise<CreateProjectRoleResponse> => {
  const res = await api.post<CreateProjectRoleResponse>(
    `/api/v1/projects/${projectId}/roles`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getProjectRoles = async (
  projectId: string,
  accessToken: string
): Promise<GetProjectRolesResponse> => {
  const res = await api.get<GetProjectRolesResponse>(
    `/api/v1/projects/${projectId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const updateProjectRole = async (
  projectId: string,
  roleId: string,
  accessToken: string,
  body: CreateProjectRoleRequest
): Promise<UpdateProjectRoleResponse> => {
  const res = await api.put<UpdateProjectRoleResponse>(
    `/api/v1/projects/${projectId}/roles/${roleId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const deleteProjectRole = async (
  projectId: string,
  roleId: string,
  accessToken: string
): Promise<DeleteProjectRoleResponse> => {
  const res = await api.delete<DeleteProjectRoleResponse>(
    `/api/v1/projects/${projectId}/roles/${roleId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const addRoleRequirement = async (
  projectId: string,
  roleId: string,
  accessToken: string,
  body: AddRoleRequirementRequest
): Promise<AddRoleRequirementResponse> => {
  const res = await api.post<AddRoleRequirementResponse>(
    `/api/v1/projects/${projectId}/roles/${roleId}/requirements`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getRoleRequirements = async (
  projectId: string,
  roleId: string,
  accessToken: string
): Promise<GetRoleRequirementsResponse> => {
  const res = await api.get<GetRoleRequirementsResponse>(
    `/api/v1/projects/${projectId}/roles/${roleId}/requirements`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const deleteRoleRequirement = async (
  projectId: string,
  roleId: string,
  requirementId: string,
  accessToken: string
): Promise<DeleteRoleRequirementResponse> => {
  const res = await api.delete<DeleteRoleRequirementResponse>(
    `/api/v1/projects/${projectId}/roles/${roleId}/requirements/${requirementId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
