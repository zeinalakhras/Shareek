import { api } from "../axiosInstance";
import { GetSkillResponse, GetSkillsResponse } from "./types";

export const getSkills = async (): Promise<GetSkillsResponse> => {
  const res = await api.get<GetSkillsResponse>("/api/v1/skills");

  return res.data;
};

export const getSkill = async (skillId: string): Promise<GetSkillResponse> => {
  const res = await api.get<GetSkillResponse>(`/api/v1/skills/${skillId}`);

  return res.data;
};
