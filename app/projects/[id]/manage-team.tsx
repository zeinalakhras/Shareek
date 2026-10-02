import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ManageTeamView } from '@/components/project-details/ManageTeamView';
import { mockAllProjectsResponse, CURRENT_TEST_USER_ID, mockRecommendedProjectsResponse } from '@/MockData/projectsMock2';
import { getUserRole } from '@/utils/projectUtils';
import { Project } from '@/types/project';

export default function ManageTeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const currentUserId = CURRENT_TEST_USER_ID;
  const allProjects = [
    ...(mockAllProjectsResponse?.data?.items || []),
    ...(mockRecommendedProjectsResponse?.data?.items || []),
  ] as Project[];

  const project = allProjects.find((item) => item.id === id);
  const userRole = getUserRole(project, currentUserId);

  // 🔒 حماية الشاشة: الدخول للمالك فقط
  if (userRole !== 'owner') {
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

  return (
    <ManageTeamView
      project={project}
      onBack={() => router.back()}
      onAcceptApplicant={(applicantId) => console.log('Accepted:', applicantId)}
      onDeclineApplicant={(applicantId) => console.log('Declined:', applicantId)}
      onChatWithMember={(memberId) => console.log('Chat:', memberId)}
    />
  );
}