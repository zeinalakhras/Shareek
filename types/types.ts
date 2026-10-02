export interface UserSummaryDTO {
  id: string;
  full_name: string;
  profile_image: string | null;
}

export interface ProjectMember {
  id: string;
  full_name: string;
  profile_image?: string | null;
  role_title?: string;
}

export interface OpenRoleDTO {
  id: string;
  title: string;
  description?: string;
  commitment_type?: string; // e.g. "Part-time", "Volunteer", "Equity"
  requirements?: string[];
  isRequired?: boolean;
  requiredCount?: number;
  filledCount?: number;
  skills?: string[];
}

export interface ProjectSummaryDTO {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'blocked' | 'insufficientPartners' | string;
  visibility: string;
  work_type: 'remote' | 'onsite' | 'hybrid';
  duration: string;
  is_university_project: boolean;
  image_url: string | null;
  owner: UserSummaryDTO;
  stars_count: number;
  members_count: number;
  created_at: string;
  members?: ProjectMember[];
  open_roles?: OpenRoleDTO[];   
  github_url?: string;
  website_url?: string;
  tags?: string[];
  prep_ends_at?: string;
  manual_start_window_ends_at?: string;
}

export interface RecommendedProjectDTO extends ProjectSummaryDTO {
  match_score: number;
  matching_skills: string[];
}

export interface PaginationDTO {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
}
