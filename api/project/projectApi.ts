import { api } from "../axiosInstance";
import {
  CancelBody,
  CancelProjectResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  GetMyProjectsParams,
  GetMyProjectsResponse,
  GetProjectFeedResponse,
  GetProjectMembersResponse,
  GetProjectResponse,
  GetProjectsParams,
  GetProjectsResponse,
  PublishBody,
  PublishProjectResponse,
  StarProjectResponse,
  StartProjectResponse,
  UnstarProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  UploadProjectAvatarResponse,
} from "./types";

export const createProject = async (
  accessToken: string,
  body: CreateProjectRequest,
): Promise<CreateProjectResponse> => {
  const res = await api.post<CreateProjectResponse>("/api/v1/projects", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const publishProject = async (
  projectId: string,
  accessToken: string,
  body: PublishBody,
): Promise<PublishProjectResponse> => {
  const res = await api.post<PublishProjectResponse>(
    `/api/v1/projects/${projectId}/publish`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const startProject = async (
  projectId: string,
  accessToken: string,
): Promise<StartProjectResponse> => {
  const res = await api.post<StartProjectResponse>(
    `/api/v1/projects/${projectId}/start`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const cancelProject = async (
  projectId: string,
  accessToken: string,
  body: CancelBody,
): Promise<CancelProjectResponse> => {
  const res = await api.post<CancelProjectResponse>(
    `/api/v1/projects/${projectId}/cancel`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

const serializeListParams = (params: Record<string, unknown>): string => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, String(entry)));
      return;
    }

    search.append(key, String(value));
  });

  return search.toString();
};

export const getProjects = async (
  accessToken: string,
  params?: GetProjectsParams,
): Promise<GetProjectsResponse> => {
  const res = await api.get<GetProjectsResponse>("/api/v1/projects", {
    params: {
      q: params?.q,
      status: params?.status,
      page: params?.page,
      per_page: params?.per_page,
    },
    paramsSerializer: { serialize: serializeListParams },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const getProjectFeed = async (
  accessToken: string,
): Promise<GetProjectFeedResponse> => {
  const res = await api.get<GetProjectFeedResponse>("/api/v1/projects/feed", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const getProject = async (
  projectId: string,
  accessToken: string,
): Promise<GetProjectResponse> => {
  const res = await api.get<GetProjectResponse>(
    `/api/v1/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const getMyProjects = async (
  accessToken: string,
  params?: GetMyProjectsParams,
): Promise<GetMyProjectsResponse> => {
  const res = await api.get<GetMyProjectsResponse>("/api/v1/projects/me", {
    params: {
      role: params?.role,
      status: params?.status,
      page: params?.page,
      per_page: params?.per_page,
    },
    paramsSerializer: { serialize: serializeListParams },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const updateProject = async (
  projectId: string,
  accessToken: string,
  body: UpdateProjectRequest,
): Promise<UpdateProjectResponse> => {
  const res = await api.patch<UpdateProjectResponse>(
    `/api/v1/projects/${projectId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const uploadProjectAvatar = async (
  projectId: string,
  accessToken: string,
  file: File,
): Promise<UploadProjectAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<UploadProjectAvatarResponse>(
    `/api/v1/projects/${projectId}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const getProjectMembers = async (
  projectId: string,
  accessToken: string,
): Promise<GetProjectMembersResponse> => {
  const res = await api.get<GetProjectMembersResponse>(
    `/api/v1/projects/${projectId}/members`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const starProject = async (
  projectId: string,
  accessToken: string,
): Promise<StarProjectResponse> => {
  const res = await api.post<StarProjectResponse>(
    `/api/v1/projects/${projectId}/star`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};

export const unstarProject = async (
  projectId: string,
  accessToken: string,
): Promise<UnstarProjectResponse> => {
  const res = await api.delete<UnstarProjectResponse>(
    `/api/v1/projects/${projectId}/star`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};
