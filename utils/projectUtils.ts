import { Project, UserRole } from '../types/project';

/**
 * دالة لحساب دور المستخدم بناءً على معرّفه (currentUserId)
 */
export const getUserRole = (
  project?: Project | null,
  currentUserId?: string | null
): UserRole => {
  if (!project || !currentUserId) return 'viewer';

  // 1. التحقق إذا كان المستخدم هو المالك
  if (project.owner && project.owner.id === currentUserId) {
    return 'owner';
  }

  // 2. التحقق إذا كان المستخدم موجوداً ضمن قائمة أعضاء الفريق
  if (project.members && Array.isArray(project.members)) {
    const isMember = project.members.some((member) => member.id === currentUserId);
    if (isMember) return 'member';
  }

  // 3. في حال لم يكن مالكاً ولا عضواً
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