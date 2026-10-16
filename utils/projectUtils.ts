import { Share } from 'react-native';
import * as Linking from 'expo-linking';
import { Project, ProjectStatus, UserRole } from '../types/project';
import type { Project as ApiProject } from '../api/project/types';

export const toProjectView = (api: ApiProject): Project => {
  const members = api.members ?? [];
  const roles = api.roles ?? [];

  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    status: (api.status ?? '') as ProjectStatus,
    visibility: api.visibility === 'private' ? 'private' : 'public',
    github_url: api.githubUrl ?? undefined,
    website_url: api.demoUrl ?? undefined,
    image_url: api.coverImage,

    members_count: members.length,
    owner: {
      id: api.creatorId,
      full_name: api.creator?.full_name ?? 'Unknown',
      profile_image: api.creator?.profile_image ?? null,
    },
    members: members.map((member) => ({
      id: member.userId,
      full_name: member.user?.full_name ?? 'Unknown',
      profile_image: member.user?.profile_image ?? undefined,
      role_title: member.functionalRoleName ?? member.role ?? undefined,
      is_verified: member.user?.is_verified ?? false,
    })),
    open_roles: roles
      .filter((role) => (role.requiredCount ?? 0) > (role.filledCount ?? 0))
      .map((role) => ({
        id: role.roleId,
        title: role.roleName,
        description: role.description ?? undefined,
        requirements: role.requirements?.map((requirement) => requirement.skillName),
      })),
  };
};


export const getUserRole = (
  project?: Project | null,
  currentUserId?: string | null
): UserRole => {
  if (!project || !currentUserId) return 'viewer';

  if (project.owner && project.owner.id === currentUserId) {
    return 'owner';
  }

  if (project.members && Array.isArray(project.members)) {
    const isMember = project.members.some((member) => member.id === currentUserId);
    if (isMember) return 'member';
  }

  return 'viewer';
};

export const getMyProjects = (projects: Project[], currentUserId: string): Project[] => {
  if (!projects || !currentUserId) return [];

  return projects.filter((project) => {
    const isOwner = project.owner?.id === currentUserId;
    const isMember = project.members?.some((member) => member.id === currentUserId);

    return isOwner || isMember;
  });
};

export const shareProject = async (
  project: Pick<Project, 'id' | 'name'>
): Promise<boolean> => {
  const url = Linking.createURL(`/projects/${project.id}`);

  try {
    await Share.share({
      title: project.name,
      message: `Check out "${project.name}" on Shareek\n${url}`,
      url,
    });
    return true;
  } catch {
    return false;
  }
};