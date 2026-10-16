import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { Project } from '@/types/project';
import type { ProjectSummaryDTO } from '@/types/types';

const SAVED_PROJECTS_KEY = 'shareek.saved_projects';
const isWeb = Platform.OS === 'web';

let cache: ProjectSummaryDTO[] = [];
let hydration: Promise<ProjectSummaryDTO[]> | null = null;
let dirtyBeforeHydration = false;

const readFromDisk = async (): Promise<ProjectSummaryDTO[]> => {
  try {
    const raw = isWeb
      ? globalThis.localStorage?.getItem(SAVED_PROJECTS_KEY)
      : await AsyncStorage.getItem(SAVED_PROJECTS_KEY);

    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProjectSummaryDTO[]) : [];
  } catch {
    return [];
  }
};

const writeToDisk = (projects: ProjectSummaryDTO[]): void => {
  dirtyBeforeHydration = true;

  try {
    const raw = JSON.stringify(projects);
    if (isWeb) {
      globalThis.localStorage?.setItem(SAVED_PROJECTS_KEY, raw);
    } else {
      void AsyncStorage.setItem(SAVED_PROJECTS_KEY, raw);
    }
  } catch {
  }
};

export const hydrateSavedProjects = (): Promise<ProjectSummaryDTO[]> => {
  hydration ??= readFromDisk().then((projects) => {
    if (!dirtyBeforeHydration) cache = projects;
    return cache;
  });

  return hydration;
};

export const toSavedSummary = (project: Project): ProjectSummaryDTO => ({
  id: project.id,
  name: project.name,
  description: project.description ?? '',
  status: project.status,
  visibility: project.visibility ?? 'public',
  work_type: (project.work_type as ProjectSummaryDTO['work_type']) ?? 'remote',
  duration: project.duration ?? '',
  is_university_project: project.is_university_project ?? false,
  image_url: project.image_url ?? null,
  owner: {
    id: project.owner?.id ?? '',
    full_name: project.owner?.full_name ?? 'Unknown',
    profile_image: project.owner?.profile_image ?? null,
  },
  stars_count: 0,
  members_count: project.members_count ?? project.members?.length ?? 0,
  created_at: new Date().toISOString(),
  tags: project.tags,
  github_url: project.github_url,
  website_url: project.website_url,
});

export const getSavedProjects = (): ProjectSummaryDTO[] => cache;

export const isProjectSaved = (id: string): boolean =>
  cache.some((project) => project.id === id);

export const removeSavedProject = (id: string): ProjectSummaryDTO[] => {
  cache = cache.filter((project) => project.id !== id);
  writeToDisk(cache);
  return cache;
};

export const toggleSavedProject = (
  project: Project
): { isSaved: boolean; saved: ProjectSummaryDTO[] } => {
  const exists = cache.some((item) => item.id === project.id);
  cache = exists
    ? cache.filter((item) => item.id !== project.id)
    : [toSavedSummary(project), ...cache];

  writeToDisk(cache);
  return { isSaved: !exists, saved: cache };
};
