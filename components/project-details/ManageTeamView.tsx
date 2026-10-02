import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicantModal } from './ApplicantModal';
import { Project } from '@/types/project';

export interface Applicant {
  id: string;
  name: string;
  appliedRole: string;
  matchPercentage: number;
  skills: string[];
  extraSkillsCount?: number;
  avatarUrl?: string;
  bio?: string;
}

interface ManageTeamViewProps {
  project?: Project;
  daysToKickoff?: number;
  filledRoles?: number;
  totalRoles?: number;
  openRolesText?: string;
  applicants?: Applicant[];
  onBack?: () => void;
  onEdit?: () => void;
  onAcceptApplicant?: (id: string) => void;
  onDeclineApplicant?: (id: string) => void;
  onChatWithMember?: (id: string) => void;
}

export const ManageTeamView: React.FC<ManageTeamViewProps> = ({
  project,
  daysToKickoff = 12,
  filledRoles = 3,
  totalRoles = 5,
  openRolesText = '2 roles open (Frontend Dev, Marketing)',
  applicants = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      appliedRole: 'UX Designer',
      matchPercentage: 98,
      skills: ['Figma', 'Prototyping'],
      extraSkillsCount: 3,
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'I have 3 years of experience in designing advanced interfaces for mobile applications and a deep understanding of the importance of user experience and how to achieve it.',
    },
    {
      id: '2',
      name: 'David Chen',
      appliedRole: 'Frontend Dev',
      matchPercentage: 85,
      skills: ['React', 'Tailwind'],
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Passionate frontend developer with 2+ years of React Native and Expo experience building clean UI components.',
    },
    {
      id: '3',
      name: 'Marcus King',
      appliedRole: 'Marketing',
      matchPercentage: 72,
      skills: ['SEO', 'Content'],
      avatarUrl: 'https://randomuser.me/api/portraits/men/86.jpg',
      bio: 'Experienced growth marketer focused on app store optimization and digital content strategies.',
    },
  ],
  onBack,
  onEdit,
  onAcceptApplicant,
  onDeclineApplicant,
  onChatWithMember,
}) => {

  const router = useRouter();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen , setIsModalOpen] = useState<boolean>(false)
  const progressPercent = Math.round((filledRoles / totalRoles) * 100);

  const getMatchBadgeStyle = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-100 text-emerald-700';
    if (percentage >= 80) return 'bg-amber-100 text-amber-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-bg">

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm"
        >
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-xl font-bold text-text-title">Manage Team</Text>
          <Text className="text-xs font-bold text-primary-full uppercase tracking-wider">
            {project?.name}
          </Text>
        </View>

        <TouchableOpacity onPress={onEdit} className="p-2">
          <Text className="text-sm font-bold text-primary-full">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

        {/* Team Status Card */}
        <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-slate-50 mt-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-lg font-bold text-text-title">Team Status</Text>
            <View className="bg-primary-light px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-primary-full">{project?.status}</Text>
            </View>
          </View>

          <Text className="text-xs font-medium text-slate-400 mb-4">
            Project kick-off in {daysToKickoff} days
          </Text>

          <View className="flex-row justify-between items-end mb-2">
            <Text className="text-3xl font-extrabold text-text-title">{progressPercent}%</Text>
            <Text className="text-xs font-semibold text-slate-400">
              {filledRoles}/{totalRoles} roles filled
            </Text>
          </View>

          <View className="w-full h-2.5 bg-primary-light rounded-full overflow-hidden mb-3">
            <View
              className="h-full bg-primary-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>

          <Text className="text-xs font-semibold text-primary-full">
            {openRolesText}
          </Text>
        </View>

        {/* View Tasks Button */}
        <TouchableOpacity
          onPress={() => Alert.alert(
            "Coming Soon" ,
            "This feature will be released in the next version.",
            [
              {
                text: 'OK',
                onPress: () => console.log('OK'),
                style: 'cancel'
              },
            ],
            { cancelable: true }
          )}
          className="flex-row justify-center items-center bg-white rounded-full py-3.5 px-4 mb-6 shadow-sm border border-slate-100"
        >
          <Text className="text-sm font-bold text-text-title mr-2">View Tasks</Text>
        </TouchableOpacity>

        {/* Pending Review Header */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Pending Review ({applicants.length})
          </Text>
          <TouchableOpacity>
            <Text className="text-sm font-semibold text-primary-full">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Applicants List */}
        <View className="gap-3 mb-6">
          {applicants.map((item) => (
            <View key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-50">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedApplicant(item)
                  setIsModalOpen(true)
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1 mr-2">
                    {item.avatarUrl ? (
                      <Image source={{ uri: item.avatarUrl }} className="w-12 h-12 rounded-full mr-3" />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-slate-200 justify-center items-center mr-3">
                        <Ionicons name="person" size={22} color="#64748B" />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-base font-bold text-text-title" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-xs text-slate-400 font-medium">
                        Applied for{' '}
                        <Text className="text-primary-full font-semibold">{item.appliedRole}</Text>
                      </Text>
                    </View>
                  </View>

                  <View className={`px-2.5 py-1 rounded-full ${getMatchBadgeStyle(item.matchPercentage)}`}>
                    <Text className="text-xs font-bold">{item.matchPercentage}% Match</Text>
                  </View>
                </View>

                {/* Skills */}
                <View className="flex-row flex-wrap gap-2 mb-4 pl-1">
                  {item.skills.map((skill, idx) => (
                    <View key={idx} className="bg-slate-100 px-3 py-1 rounded-xl">
                      <Text className="text-xs font-medium text-slate-600">{skill}</Text>
                    </View>
                  ))}
                  {item.extraSkillsCount && (
                    <View className="bg-slate-100 px-3 py-1 rounded-xl">
                      <Text className="text-xs font-medium text-slate-600">
                        +{item.extraSkillsCount} more
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => onDeclineApplicant?.(item.id)}
                  className="flex-1 border border-slate-300 py-3 rounded-2xl items-center active:bg-slate-50"
                >
                  <Text className="text-slate-400 font-bold text-sm">Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onAcceptApplicant?.(item.id)}
                  className="flex-1 bg-primary-full py-3 rounded-2xl items-center shadow-sm active:opacity-90"
                >
                  <Text className="text-white font-bold text-sm">Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Current Members Header */}
        <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Current Members ({project?.members?.length})
        </Text>

        {/* Current Members List */}
        <View className="bg-white rounded-3xl p-2 mb-10 shadow-sm border border-slate-50">
          {project?.members?.map((member, idx) => (
            <View
              key={member.id}
              className={`flex-row items-center justify-between p-3 ${idx !== (project.members?.length ?? 0) - 1 ? 'border-b border-slate-100' : ''
                }`}
            >
              <View className="flex-row items-center flex-1">
                {member.profile_image ? (
                  <Image source={{ uri: member.profile_image }} className="w-11 h-11 rounded-full mr-3" />
                ) : (
                  <View className="w-11 h-11 rounded-full bg-slate-100 justify-center items-center mr-3">
                    <Ionicons name="person" size={20} color="#94A3B8" />
                  </View>
                )}
                <View>
                  <Text className="text-sm font-bold text-text-title">{member.full_name}</Text>
                  <Text className="text-xs text-slate-400 font-medium">{member.role_title}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => onChatWithMember?.(member.id)} className="p-2">
                <Feather name="message-square" size={20} color="#FF8C69" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Applicant Details Modal */}
      <ApplicantModal
        visible={isModalOpen}
        applicant={
          selectedApplicant
            ? {
              id: selectedApplicant.id,
              name: selectedApplicant.name,
              role: selectedApplicant.appliedRole,
              match: `${selectedApplicant.matchPercentage}% Match`,
              avatar: selectedApplicant.avatarUrl || '',
              skills: selectedApplicant.skills,
              bio: selectedApplicant.bio || 'No application details provided.',
            }
            : null
        }
        onClose={() => {
          setIsModalOpen(false)
        }}
        onAccept={(id) => {
          onAcceptApplicant?.(id);
          setSelectedApplicant(null);
        }}
        onDecline={(id) => {
          onDeclineApplicant?.(id);
          setSelectedApplicant(null);
        }}
      />
    </SafeAreaView >
  );
};