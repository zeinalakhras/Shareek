import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ManageTeamView, Applicant } from '@/components/project-details/ManageTeamView';
import { getProject } from '@/api/project/projectApi';
import { getApplications, updateApplicationStatus } from '@/api/application/applicationApi';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';
import { getUserRole, toProjectView } from '@/utils/projectUtils';
import type { Project as ApiProject } from '@/api/project/types';

export default function ManageTeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const currentUserId = profile?.id ?? user?.id ?? null;

  const [apiProject, setApiProject] = useState<ApiProject | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (showSpinner: boolean) => {
    if (!accessToken || !id) {
      setIsLoading(false);
      return;
    }

    if (showSpinner) {
      setIsLoading(true);
      setLoadError(null);
    }

    try {
      const [projectResponse, applicationsResponse] = await Promise.all([
        getProject(String(id), accessToken),
        getApplications(accessToken, { project_id: String(id), page: 1, per_page: 50 }),
      ]);

      setApiProject(projectResponse.data ?? null);
      setApplicants(
        (applicationsResponse.data?.items ?? []).map((application) => ({
          id: application.id,
          name: application.applicantName || 'Unknown applicant',
          appliedRole: application.roleName || 'Unknown role',

          bio: application.message || undefined,
        }))
      );
    } catch (error) {
      if (showSpinner) {
        setLoadError(getApiErrorMessage(error, 'Could not load this project.'));
      }
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }, [accessToken, id]);

  useFocusEffect(
    useCallback(() => {
      load(true);
    }, [load])
  );

  const decide = async (applicantId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!accessToken) return;

    try {
      await updateApplicationStatus(
        applicantId,
        {
          status,
          reason: status === 'ACCEPTED'
            ? 'Accepted by the project owner'
            : 'Not a fit for this role',
        },
        accessToken
      );

      setApplicants((current) =>
        current.filter((applicant) => applicant.id !== applicantId)
      );
      await load(false);
    } catch (error) {
      Alert.alert(
        status === 'ACCEPTED' ? 'Could not accept' : 'Could not decline',
        getApiErrorMessage(error, 'The decision was not saved.')
      );
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
          onPress={() => load(true)}
          className="mt-4 bg-primary-full px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!apiProject) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB] justify-center items-center p-6">
        <Feather name="alert-circle" size={48} color="#A0AEC0" />
        <Text className="text-[#1E3A47] font-bold text-lg mt-3">Project not found</Text>
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

  if (getUserRole(project, currentUserId) !== 'owner') {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA] justify-center items-center p-6">
        <Text className="text-slate-800 font-bold text-lg mb-1">Access Denied</Text>
        <Text className="text-slate-500 text-sm text-center mb-5">
          This management page is only accessible by the project owner.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#F97316] px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const openRoles = project.open_roles ?? [];
  const filledRoles = project.members?.length ?? 0;
  const totalRoles = filledRoles + openRoles.length;

  return (
    <ManageTeamView
      project={project}
      filledRoles={filledRoles}
      totalRoles={totalRoles}
      openRolesText={
        openRoles.length > 0
          ? `${openRoles.length} role${openRoles.length === 1 ? '' : 's'} open (${openRoles
              .map((role) => role.title)
              .join(', ')})`
          : 'All roles are filled'
      }
      applicants={applicants}
      onBack={() => router.back()}
      onAcceptApplicant={(applicantId) => decide(applicantId, 'ACCEPTED')}
      onDeclineApplicant={(applicantId) => decide(applicantId, 'REJECTED')}
      onChatWithMember={(memberId) => router.push(`/users/${memberId}`)}
    />
  );
}