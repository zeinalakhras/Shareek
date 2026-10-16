import { api } from "../axiosInstance";
import {
  CreateCompletionRequest,
  CreateCompletionResponse,
  RemoveProjectMemberResponse,
  RequestWithdrawalResponse,
} from "./types";

export const createCompletionRequest = async (
  projectId: string,
  accessToken: string,
  body: CreateCompletionRequest
): Promise<CreateCompletionResponse> => {
  const res = await api.post<CreateCompletionResponse>(
    `/api/v1/projects/${projectId}/completion`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const removeProjectMember = async (
  projectId: string,
  userId: string,
  accessToken: string
): Promise<RemoveProjectMemberResponse> => {
  const res = await api.delete<RemoveProjectMemberResponse>(
    `/api/v1/projects/${projectId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

/**
 * A member never leaves instantly — §7 has them file a withdrawal request that
 * the owner approves. Allowed while the project is PREPARATION or IN_PROGRESS.
 */
export const requestWithdrawal = async (
  projectId: string,
  accessToken: string,
  reason: string
): Promise<RequestWithdrawalResponse> => {
  const res = await api.post<RequestWithdrawalResponse>(
    `/api/v1/projects/${projectId}/withdrawals`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
