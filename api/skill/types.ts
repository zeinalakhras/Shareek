import { ApiResponse } from "../auth/types";

export interface Skill {
  id: string;
  name: string;
}

export type GetSkillsResponse = ApiResponse<Skill[]>;
export type GetSkillResponse = ApiResponse<Skill>;
