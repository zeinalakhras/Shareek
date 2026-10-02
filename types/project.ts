export type ProjectStatus = 'active' | 'completed' | 'blocked' | 'insufficientPartners' | 'draft' | 'DRAFT' | 'RECRUITING' | 'PREPARATION' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED' | 'DELETED';
export type UserRole = 'owner' | 'member' | 'viewer';

export interface ProjectMember {
  id: string;
  full_name: string;
  profile_image?: string | undefined;
  role_title?: string;
}

export interface ProjectOwner {
  id: string;
  full_name: string;
  profile_image?: string | null;
}

export interface OpenRole {
  id: string;
  title: string;
  description?: string;
  commitment_type?: string;
  requirements?: string[];
  skills?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  work_type?: string;
  tags?: string[];
  owner?: ProjectOwner;
  members?: ProjectMember[];
  github_url?: string;
  website_url?: string;
  visibility?: 'public' | 'private';
  duration?: string;
  is_university_project?: boolean;
  image_url?: string | null;
  members_count?: number;
  open_roles?: OpenRole[];
}

export interface ProjectDraft {
  id: string;
  name: string;
  description?: string; // Made optional for partially filled drafts
  status: ProjectStatus; // Ensure ProjectStatus union includes 'DRAFT'
  work_type?: string;
  tags?: string[];
  owner?: ProjectOwner;
  duration?: string;
  is_university_project?: boolean;
  image_url?: string | null;
  open_roles?: OpenRole[];
  created_at?: string;
  updated_at?: string; // Essential for sorting drafts by last updated date
}
