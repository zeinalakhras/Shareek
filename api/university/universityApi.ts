import { api } from "../axiosInstance";
import { GetUniversitiesResponse, GetUniversityResponse } from "./types";

export const getUniversities =
  async (): Promise<GetUniversitiesResponse> => {
    const res = await api.get<GetUniversitiesResponse>(
      "/api/v1/universities"
    );

    return res.data;
  };

export const getUniversity = async (
  universityId: string
): Promise<GetUniversityResponse> => {
  const res = await api.get<GetUniversityResponse>(
    `/api/v1/universities/${universityId}`
  );

  return res.data;
};
