import { api } from "../axiosInstance";
import {
  GetUserProjectsResponse,
  GetUserResponse,
  SyncRolesRequest,
  SyncRolesResponse,
  SyncSkillsRequest,
  SyncSkillsResponse,
  UpdateEducationRequest,
  UpdateEducationResponse,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UploadAvatarResponse,
} from "./types";

export const getUser = async (
  userId: string,
  accessToken: string,
): Promise<GetUserResponse> => {
  const res = await api.get<GetUserResponse>(`/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const getUserProjects = async (
  userId: string,
  accessToken: string,
): Promise<GetUserProjectsResponse> => {
  const res = await api.get<GetUserProjectsResponse>(
    `/api/v1/users/${userId}/project`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const updateUser = async (
  userId: string,
  body: UpdateUserRequest,
  accessToken: string,
): Promise<UpdateUserResponse> => {
  const res = await api.patch<UpdateUserResponse>(
    `/api/v1/users/${userId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const updatePreferences = async (
  userId: string,
  body: UpdatePreferencesRequest,
  accessToken: string,
): Promise<UpdatePreferencesResponse> => {
  const res = await api.patch<UpdatePreferencesResponse>(
    `/api/v1/users/${userId}/preferences`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};
    
export const updateEducation = async (
  userId: string,
  body: UpdateEducationRequest,
  accessToken: string
): Promise<UpdateEducationResponse> => {
  const res = await api.patch<UpdateEducationResponse>(
    `/api/v1/users/${userId}/education`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
    
export const syncSkills = async (
  userId: string,
  body: SyncSkillsRequest,
  accessToken: string
): Promise<SyncSkillsResponse> => {
  const res = await api.put<SyncSkillsResponse>(
    `/api/v1/users/${userId}/skills`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

    
export const syncRoles = async (
  userId: string,
  body: SyncRolesRequest,
  accessToken: string
): Promise<SyncRolesResponse> => {
  const res = await api.put<SyncRolesResponse>(
    `/api/v1/users/${userId}/roles`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
    
export const uploadAvatar = async (
  userId: string,
  file: File,
  accessToken: string
): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<UploadAvatarResponse>(
    `/api/v1/users/${userId}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
