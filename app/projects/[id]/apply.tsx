import React, { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { isAxiosError } from 'axios';

import ApplyToJoinView, { ApplyFormData } from '@/components/project-details/ApplyToJoinView';
import { getProject } from '@/api/project/projectApi';
import { createApplication } from '@/api/application/applicationApi';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';
import { toProjectView } from '@/utils/projectUtils';
import type { Project as ApiProject } from '@/api/project/types';

export default function ApplyScreen() {
  const router = useRouter();
  const { id, roleId } = useLocalSearchParams<{ id: string; roleId?: string }>();

  const accessToken = useAuthStore((state) => state.accessToken);

  const [apiProject, setApiProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

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
    }, [accessToken, id])
  );

  const handleSubmit = async (data: ApplyFormData): Promise<boolean> => {
    if (!accessToken || !id) return false;

    try {
      await createApplication(
        {
          projectId: String(id),
          roleId: data.roleId,
          message: data.whyJoin,
        },
        accessToken
      );
      return true;
    } catch (error) {
      Alert.alert('Could not apply', getApiErrorMessage(error, 'Your application was not sent.'));
      return false;
    }
  };

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
          onPress={() => router.back()}
          className="mt-4 bg-primary-full px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Go Back</Text>
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

  return (
    <ApplyToJoinView
      project={toProjectView(apiProject)}
      initialRoleId={roleId ? String(roleId) : undefined}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}