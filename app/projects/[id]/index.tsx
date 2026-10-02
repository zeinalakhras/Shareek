import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { mockAllProjectsResponse, CURRENT_TEST_USER_ID, mockRecommendedProjectsResponse, MOCK_DRAFTS } from '@/MockData/projectsMock2';
import { getUserRole } from '@/utils/projectUtils';
import { Project } from '@/types/project';

// استيراد واجهة المشاريع قيد العمل (Active)
import ActiveProjectView from '@/components/project-details/ActiveProjectView';
import { BlockedProjectView } from '@/components/project-details/BlockedProjectView';
import { CompletedProjectView } from '@/components/project-details/CompletedProjectView';
import DraftProjectView from '@/components/project-details/DraftProjectView';

// استيراد الواجهات الأخرى فور إتمام ملفاتها:
// import CompletedProjectView from '@/components/project-details/CompletedProjectView';
// import BannedProjectView from '@/components/project-details/BannedProjectView';

export default function ProjectDetailsRouter() {


  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  console.log("RECEIVED ID FROM ROUTER:", id);

  // 1. معرّف المستخدم الحالي (قم باستبداله بـ useAuth() لاحقاً)
  // للتجربة: أرسل "usr_owner1" للتجربة كمالك، أو ID آخر لتجربة العضو/الزائر
  const currentUserId = CURRENT_TEST_USER_ID;

  // 2. جلب المشروع المطابق من الـ Mock Data
  const projectsList = mockAllProjectsResponse?.data?.items || [];

  const allProjects = [
    ...(mockAllProjectsResponse?.data?.items || []),
    ...(mockRecommendedProjectsResponse?.data?.items || []),
  ] as Project[];

  const project = allProjects.find((item) => item.id === id) as Project | undefined;

  const draftProject = MOCK_DRAFTS.find((item) => item.id === id);

  if (draftProject?.status === 'draft') {
    return (
      <DraftProjectView
        project={draftProject}
        onBack={() => router.back()}
      />
    );
  }
    
    // 3. حساب دور المستخدم بناءً على بيانات المشروع
    const userRole = getUserRole(project, currentUserId);

    // 4. حالة عدم العثور على المشروع
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

  // 5. حالة المشروع المحظور (Banned)
  if (project.status === 'blocked') {
    // return <BannedProjectView project={project} userRole={userRole} />;
    return (
      <BlockedProjectView
        projectName={project.name}
        category={`${project.work_type} • ${project.is_university_project ? 'University' : 'Side Project'}`}
        imageUrl={project.image_url}
        onContactSupport={() => {
          // توجيه لصفحة الدعم أو فتح البريد الإلكتروني
          console.log("Contact Support Pressed");
        }}
      />
    );
  }

  // 6. حالة المشروع المكتمل (Completed)
  if (project.status === 'completed') {
    // return <CompletedProjectView project={project} userRole={userRole} />;
    return (
      <CompletedProjectView
        project={project}
        useRole={userRole}
      />
    );
  }

  // 7. حالة المشروع قيد العمل (Active)
  return (
    <ActiveProjectView
      project={project}
      userRole={userRole}
    />
  );
}