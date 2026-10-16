import { api } from "../axiosInstance";
import { BlockUserRequest, BlockUserResponse, UnblockUserResponse, GetBlockedUsersResponse } from "./types";

export const blockUser = async (
  userId: string,
  body: BlockUserRequest,
  accessToken: string
): Promise<BlockUserResponse> => {
  const res = await api.post<BlockUserResponse>(
    `/api/v1/users/${userId}/blocks`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const unblockUser = async (
  userId: string,
  accessToken: string
): Promise<UnblockUserResponse> => {
  const res = await api.delete<UnblockUserResponse>(
    `/api/v1/users/${userId}/blocks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getBlockedUsers = async (
  accessToken: string
): Promise<GetBlockedUsersResponse> => {
  const res = await api.get<GetBlockedUsersResponse>(
    "/api/v1/blocks",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};
