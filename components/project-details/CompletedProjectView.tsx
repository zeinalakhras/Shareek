import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProjectCompletedModal } from './ProjectCompletedModal';
import { Project, UserRole } from '@/types/project';
import { CURRENT_TEST_USER_ID } from '@/MockData/projectsMock2';

interface CompletedProjectViewProps {
  project: Project;
  useRole: UserRole;
  onEditOverview?: () => void;
  onAddTag?: () => void;
  onEditLink?: (link: any) => void;
  onOpenLink?: (link: any) => void;
  onSubmitFeedback?: (rating: number) => void;
}

export const CompletedProjectView: React.FC<CompletedProjectViewProps> = ({
  project,
  useRole,
  onEditOverview,
  onAddTag,
  onEditLink,
  onOpenLink,
  onSubmitFeedback,
}) => {

  const router = useRouter();
  const [rating, setRating] = useState(4);

  const handleUserProfilePress = (userId: string) => {
    if (userId === CURRENT_TEST_USER_ID) {
      router.push('/(tabs)/profile'); 
    } else {
      router.push(`/users/${userId}`); 
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-bg">

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-50">
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View className="flex-row gap-3">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm">
            <Ionicons name="bookmark-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm">
            <Ionicons name="share-social" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

        {/* Project Header & Badge */}
        <View className="items-center mt-3 mb-6">
          <View className="relative mb-3">
            {project.image_url ? (
              <Image source={{ uri: project.image_url }} className="w-24 h-24 rounded-full bg-slate-200" />
            ) : (
              <View className="w-24 h-24 bg-primary-light justify-center items-center rounded-full">
                <Ionicons name="laptop-outline" size={44} color="#FF8C69" />
              </View>
            )}
            {/* Green Checkmark Overlay Badge */}
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
              <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-text-title text-center mb-1">{project.name}</Text>
          <Text className="text-sm font-semibold text-slate-500 text-center">{project.work_type} • {project.is_university_project ? 'University' : 'Side Project'}</Text>
        </View>

        {/* Project Overview */}
        <Text className="text-lg font-bold text-text-title mb-3">Project Overview</Text>
        <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-slate-50">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="flex-1 text-sm text-gray-700 leading-6 mr-2">
              {project.description}
            </Text>
            {useRole == 'owner' && (
              <TouchableOpacity onPress={onEditOverview}>
                <Text className="text-xs font-semibold text-primary-full">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap items-center gap-2 mt-4">
            {project.tags?.map((tag, idx) => (
              <View key={idx} className="bg-slate-100 px-3 py-1.5 rounded-xl">
                <Text className="text-xs text-slate-600 font-medium">{tag}</Text>
              </View>
            ))}
            {useRole == 'owner' && (
              <TouchableOpacity onPress={onAddTag} className="px-2 py-1.5">
                <Text className="text-xs font-semibold text-primary-full">+ Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Links & Resources */}
        <Text className="text-lg font-bold text-text-title mb-3">Links & Resources</Text>
        <View className="mb-6 gap-3">
          {project.github_url && (
            <View className="flex-row items-center justify-between bg-white px-4 py-3.5 rounded-2xl shadow-sm border border-slate-50 mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <Feather name="code" size={18} color="#FF8C69" />
                <Text className="text-sm font-semibold text-slate-600 ml-3 flex-1" numberOfLines={1}>
                  {project.github_url}
                </Text>
              </View>

              {useRole === 'owner' ? (
                <TouchableOpacity
                  onPress={() =>
                    onEditLink?.({
                      id: 'link_github',
                      title: 'GitHub Repository',
                      url: project.github_url!,
                      type: 'github',
                    })
                  }
                >
                  <Feather name="edit-3" size={18} color="#FF8C69" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onOpenLink?.(project.github_url!)}>
                  <Feather name="external-link" size={18} color="#FF8C69" />
                </TouchableOpacity>
              )}
            </View>
          )}
          {project.website_url && (
            <View className="flex-row items-center justify-between bg-white px-4 py-3.5 rounded-2xl shadow-sm border border-slate-50 mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <Feather name="globe" size={18} color="#FF8C69" />
                <Text className="text-sm font-semibold text-slate-600 ml-3 flex-1" numberOfLines={1}>
                  {project.website_url}
                </Text>
              </View>

              {useRole === 'owner' ? (
                <TouchableOpacity
                  onPress={() =>
                    onEditLink?.({
                      id: 'link_website',
                      title: 'Live Website',
                      url: project.website_url!,
                      type: 'website',
                    })
                  }
                >
                  <Feather name="edit-3" size={18} color="#FF8C69" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onOpenLink?.(project.website_url!)}>
                  <Feather name="external-link" size={18} color="#FF8C69" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Project Developers */}
        <Text className="text-lg font-bold text-text-title mb-3">Project developers</Text>
        <View className="mb-6 gap-3">
          {project.members?.map((member) => (
            <TouchableOpacity
              onPress={() => handleUserProfilePress(member.id)}
              key={member.id}
              className="flex-row items-center justify-between bg-white p-3.5 rounded-2xl shadow-sm border border-slate-50"
            >
              <View className="flex-row items-center flex-1">
                {member.profile_image ? (
                  <Image source={{ uri: member.profile_image }} className="w-12 h-12 rounded-full mr-3" />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-slate-200 justify-center items-center mr-3">
                    <Ionicons name="person" size={24} color="#64748B" />
                  </View>
                )}
                <View>
                  <Text className="text-base font-bold text-text-title">{member.full_name}</Text>
                  <Text className="text-xs font-medium text-slate-600">{member.role_title}</Text>
                </View>
              </View>
              {member.id === project.owner?.id && (
                <Text className="text-xs font-semibold text-primary-full">Project Lead</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Section For Viewer & Member Only */}
        {useRole !== 'owner' && (
          <View className="bg-white rounded-3xl p-6 mb-6 items-center shadow-sm border border-slate-50">
            <Text className="text-lg font-bold text-text-title mb-4">Your Feedback Matters</Text>

            {/* Stars */}
            <View className="flex-row gap-3 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#FF8C69" : "#CBD5E1"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-primary-full w-48 py-3 rounded-full items-center active:opacity-80"
              onPress={() => onSubmitFeedback?.(rating)}
            >
              <Text className="text-white font-semibold text-base">Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Button */}
        <TouchableOpacity
          className="w-full bg-primary-full py-4 rounded-full items-center shadow-md active:opacity-80 mb-8"
          onPress={() => router.push('/explore')}
        >
          {useRole == 'owner' ?
            <Text className="text-white text-base font-bold">Go to explore</Text>
            :
            <Text className="text-white text-base font-bold">Back to explore</Text>
          }
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};