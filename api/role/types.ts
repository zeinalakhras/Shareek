import { ApiResponse } from "../auth/types";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export type GetRolesResponse = ApiResponse<Role[]>;
export type GetRoleResponse = ApiResponse<Role>;
