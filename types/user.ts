export interface Skill {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface University {
  id: string;
  name: string;
}

export interface UserStats {
  stars_received: number;
  projects_count: number;
  collaborations_count: number;
}

export interface UserProfileData {
  id: string;
  full_name: string;
  bio: string;
  profile_image: string;
  is_student: boolean;
  university: University | null;
  major: string;
  study_year: number;
  skills: Skill[];
  roles: Role[];
  stats: UserStats;
  created_at: string;
  website_url: string;
  linkedin_url: string;
  github_url: string;
  collaboration_style: 'remote' | 'hybrid' | 'on_site';
  time_commitment: 'full-time' | '5-10 hours/week' | '10-20 hours/week';
  project_duration: 'long-term' | 'short-term';
  email: string;
  phone_number: string;
  location: string;
  is_verified: boolean;
  telegram_username: string | null ;
  completed_projects: string[] ;
}

export interface UserApiResponse {
  status: string;
  code: string;
  message: string;
  data: UserProfileData;
}