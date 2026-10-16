import { api } from "../axiosInstance";
import { CreateApplicationRequest, CreateApplicationResponse, GetApplicationsParams, GetApplicationsResponse, GetApplicationResponse, ApplicationStatusUpdateRequest, UpdateApplicationStatusResponse, DeleteApplicationResponse } from "./types";

export const createApplication = async (
  body: CreateApplicationRequest,
  accessToken: string
): Promise<CreateApplicationResponse> => {
  const res = await api.post<CreateApplicationResponse>(
    "/api/v1/applications",
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getApplications = async (
  accessToken: string,
  params?: GetApplicationsParams
): Promise<GetApplicationsResponse> => {
  const res = await api.get<GetApplicationsResponse>(
    "/api/v1/applications",
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getApplication = async (
  applicationId: string,
  accessToken: string
): Promise<GetApplicationResponse> => {
  const res = await api.get<GetApplicationResponse>(
    `/api/v1/applications/${applicationId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  body: ApplicationStatusUpdateRequest,
  accessToken: string
): Promise<UpdateApplicationStatusResponse> => {
  const res = await api.patch<UpdateApplicationStatusResponse>(
    `/api/v1/applications/${applicationId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const deleteApplication = async (
  applicationId: string,
  accessToken: string
): Promise<DeleteApplicationResponse> => {
  const res = await api.delete<DeleteApplicationResponse>(
    `/api/v1/applications/${applicationId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
