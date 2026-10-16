import { api } from "../axiosInstance";
import { GetRolesResponse, GetRoleResponse } from "./types";

export const getRoles = async (): Promise<GetRolesResponse> => {
  const res = await api.get<GetRolesResponse>("/api/v1/roles");

  return res.data;
};

export const getRole = async (
  roleId: string
): Promise<GetRoleResponse> => {
  const res = await api.get<GetRoleResponse>(
    `/api/v1/roles/${roleId}`
  );

  return res.data;
};
