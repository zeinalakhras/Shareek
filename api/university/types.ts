import { ApiResponse } from "../auth/types";

export interface University {
  id: string;
  name: string;
  country: string;
  website: string;
}

export type GetUniversitiesResponse = ApiResponse<University[]>;
export type GetUniversityResponse = ApiResponse<University>;
