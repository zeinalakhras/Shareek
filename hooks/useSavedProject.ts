import { useCallback, useEffect, useState } from 'react';
import type { Project } from '@/types/project';
import { hydrateSavedProjects, isProjectSaved, toggleSavedProject } from '@/utils/savedProjects';

export const useSavedProject = (project: Project | null | undefined) => {
  const projectId = project?.id;

  const [isSaved, setIsSaved] = useState<boolean>(() =>
    projectId ? isProjectSaved(projectId) : false
  );

  useEffect(() => {
    let mounted = true;

    hydrateSavedProjects().then(() => {
      if (mounted && projectId) setIsSaved(isProjectSaved(projectId));
    });

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const toggle = useCallback(() => {
    if (!project) return false;
    const { isSaved: next } = toggleSavedProject(project);
    setIsSaved(next);
    return next;
  }, [project]);

  return { isSaved, toggle };
};
