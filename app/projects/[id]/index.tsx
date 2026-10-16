import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { isAxiosError } from 'axios';

import { getProject } from '@/api/project/projectApi';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';
import { getUserRole, toProjectView } from '@/utils/projectUtils';
import type { Project as ApiProject } from '@/api/project/types';

import ActiveProjectView from '@/components/project-details/ActiveProjectView';
import { BlockedProjectView } from '@/components/project-details/BlockedProjectView';
import { CompletedProjectView } from '@/components/project-details/CompletedProjectView';
import DraftProjectView from '@/components/project-details/DraftProjectView';

const STATUS = {
  DRAFT: 'DRAFT',
  RECRUITING: 'RECRUITING',
  PREPARATION: 'PREPARATION',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SUSPENDED: 'SUSPENDED',
} as const;

export default function ProjectDetailsRouter() {


  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const currentUserId = profile?.id ?? user?.id ?? null;

  const [apiProject, setApiProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const load = async () => {
        if (!accessToken || !id) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setLoadError(null);
        setNotFound(false);

        try {
          const response = await getProject(String(id), accessToken);
          if (!cancelled) setApiProject(response.data ?? null);
        } catch (error) {
          if (cancelled) return;
          if (isAxiosError(error) && error.response?.status === 404) {
            setNotFound(true);
            setApiProject(null);
          } else {
            setLoadError(getApiErrorMessage(error, 'Could not load this project.'));
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };

      load();

      return () => {
        cancelled = true;
      };
    }, [accessToken, id, reloadKey])
  );
    
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg justify-center items-center">
        <ActivityIndicator size="large" color="#FF8C69" />
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView className="flex-1 bg-bg justify-center items-center p-6">
        <Feather name="alert-circle" size={48} color="#F56565" />
        <Text className="text-text-title font-bold text-lg mt-3 text-center">
          Could not load this project
        </Text>
        <Text className="text-slate-400 text-xs mt-2 text-center px-6">{loadError}</Text>
        <TouchableOpacity
          onPress={() => setReloadKey((key) => key + 1)}
          className="mt-4 bg-primary-full px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (notFound || !apiProject) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB] justify-center items-center p-6">
        <Feather name="alert-circle" size={48} color="#A0AEC0" />
        <Text className="text-[#1E3A47] font-bold text-lg mt-3">Project not found</Text>
        <Text className="text-[#A0AEC0] text-xs mt-2 text-center px-8">
          It may have been removed, or you may not have access to it.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-[#FF7A59] px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  const project = toProjectView(apiProject);
  const userRole = getUserRole(project, currentUserId);
  const status = String(apiProject.status ?? '').toUpperCase();

  if (status === STATUS.DRAFT) {
    return (
      <DraftProjectView
        project={project}
        onBack={() => router.back()}
        onChanged={() => setReloadKey((key) => key + 1)}
      />
    );
  }
  if (status === STATUS.SUSPENDED) {
    return (
      <BlockedProjectView
        project={project}
        projectName={project.name}
        category={`${project.visibility === 'private' ? 'Private' : 'Public'} • ${project.members_count ?? 0} members`}
        imageUrl={project.image_url}
        onContactSupport={() =>
          Alert.alert(
            'Contact Support',
            'Please email support@shareek.app and quote this project id.'
          )
        }
      />
    );
  }

  if (status === STATUS.COMPLETED) {
    return <CompletedProjectView project={project} useRole={userRole} />;
  }

  return (
    <ActiveProjectView
      project={project}
      userRole={userRole}
      onChanged={() => setReloadKey((key) => key + 1)}
    />
  );
}