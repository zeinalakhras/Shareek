import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import ApplyToJoinView from '@/components/project-details/ApplyToJoinView';
import { mockRecommendedProjectsResponse, mockAllProjectsResponse } from '@/MockData/projectsMock2';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function ApplyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // استخراج المشاريع من data.items ودمج القائمتين لضمان العثور على أي مشروع
  const recommendedProjects = mockRecommendedProjectsResponse?.data?.items || [];
  const allProjects = mockAllProjectsResponse?.data?.items || [];
  const combinedProjects = [...recommendedProjects, ...allProjects];

  // البحث عن المشروع بواسطة الـ id
  const project = combinedProjects.find((item) => String(item.id) === String(id));

  if (!project) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB] justify-center items-center p-6">
        <Feather name="alert-circle" size={48} color="#A0AEC0" />
        <Text className="text-[#1E3A47] font-bold text-lg mt-3">المشروع غير موجود</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-[#FF7A59] px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">العودة للخلف</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <ApplyToJoinView
      project={project}
      onCancel={() => router.back()}
      onSubmit={(data) => {
        console.log(`Submitted application for project: ${project.name || id}`, data);
      }}
    />
  );
}