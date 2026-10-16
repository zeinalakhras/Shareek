import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { OpenRole, Project, UserRole } from '@/types/project';
import { AddRoleModal } from '../AddRoleModal';
import { useAuthStore } from '@/store/useAuthStore';
import { cancelProject, startProject } from '@/api/project/projectApi';
import { requestWithdrawal } from '@/api/project/projectRequestApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { shareProject } from '@/utils/projectUtils';
import { useSavedProject } from '@/hooks/useSavedProject';

interface Props {
  project: Project;
  userRole: UserRole;
  onChanged?: () => void;
}

export default function ActiveProjectView({ project, userRole, onChanged }: Props) {
  const router = useRouter();

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);

  const { isSaved, toggle: toggleSaved } = useSavedProject(project);

  const handleShare = () => {
    shareProject(project);
  };

  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const currentUserId = profile?.id ?? user?.id ?? null;

  const [isBusy, setIsBusy] = useState(false);

  const status = String(project.status ?? '').toUpperCase();
  const handleSaveRole = () => {
    onChanged?.();
  };

  const onEditOverview = () => {

  }

  const onAddTag = () => {

  }

  const handleUserProfilePress = (userId: string) => {
    if (userId && userId === currentUserId) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/users/${userId}`);
    }
  };

  const onCancelPress = () => {
    Alert.alert(
      'Cancel Project',
      'Are you sure you want to stop this project? This cannot be undone.',
      [
        { text: 'Keep Project', style: 'cancel' },
        {
          text: 'Cancel Project',
          style: 'destructive',
          onPress: async () => {
            if (!accessToken || isBusy) return;
            setIsBusy(true);
            try {
              await cancelProject(project.id, accessToken, {
                reason: 'Cancelled by the project owner',
              });
              router.back();
            } catch (error) {
              Alert.alert('Could not cancel', getApiErrorMessage(error, 'The project could not be cancelled.'));
            } finally {
              setIsBusy(false);
            }
          },
        },
      ]
    );
  };
  const onStartPress = () => {
    Alert.alert(
      'Start Project',
      'Start execution now? Every required role must already be filled.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Start Project',
          onPress: async () => {
            if (!accessToken || isBusy) return;
            setIsBusy(true);
            try {
              await startProject(project.id, accessToken);
              router.back();
            } catch (error) {
              Alert.alert('Cannot start yet', getApiErrorMessage(error, 'The project could not be started.'));
            } finally {
              setIsBusy(false);
            }
          },
        },
      ]
    );
  };

  const onRequestCompletionPress = () => {
    Alert.alert(
      'Project Completion',
      'Do you want to proceed to the completion request page?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => router.push(`/projects/${project.id}/request-completion`) },
      ]
    );
  };

  const onLeavePress = () => {
    if (userRole === 'owner') {
      Alert.alert('Contact Support', 'The owner cannot leave their own project; please contact support.');
      return;
    }

    Alert.alert(
      'Leave Project',
      'Send a leave request to the project owner? They will need to approve it before you are removed.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: async () => {
            if (!accessToken || isBusy) return;
            setIsBusy(true);
            try {
              await requestWithdrawal(project.id, accessToken, 'Requested to leave the project');
              Alert.alert('Request sent', 'The owner has been notified and will review your request.');
              router.back();
            } catch (error) {
              Alert.alert('Could not send request', getApiErrorMessage(error, 'Your leave request was not sent.'));
            } finally {
              setIsBusy(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-50">
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={toggleSaved}
            className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm"
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isSaved ? '#FF8C69' : '#1A1A1A'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm"
          >
            <Ionicons name="share-social" size={20} color="#1A1A1A" />
          </TouchableOpacity>

          {userRole === 'member' && status === 'PREPARATION' && (
            <View className="flex-row justify-end mb-2">
              <TouchableOpacity
                onPress={onLeavePress}
                disabled={isBusy}
                className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
              >
                <Feather name="log-out" size={14} color="#E53E3E" />
                <Text className="text-red-600 font-bold text-xs ml-1.5">
                  {isBusy ? 'Sending…' : 'Leave Project'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {userRole === 'owner' && status == 'RECRUITING' && (
            <TouchableOpacity
              onPress={onCancelPress}
              disabled={isBusy}
              className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
              <Text className="text-red-600 font-bold text-xs ml-1.5">
                {isBusy ? 'Cancelling…' : 'Cancel Project'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Project Header */}
        <View className="items-center my-4">
          {project.image_url ? (
            <Image
              source={{ uri: project.image_url }}
              className="w-20 h-20 rounded-full mb-3 bg-slate-200"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 bg-primary-light items-center justify-center mb-3 rounded-full">
              <Ionicons name="laptop-outline" size={36} color="#FF8C69" />
            </View>
          )}
          <Text className="text-2xl font-bold text-text-title">{project.name}</Text>

          {userRole === 'owner' && (
            <Text className="text-gray-500 text-xs mt-1 font-medium">
              Project ID : {project.id}
            </Text>
          )}

          <Text className="text-gray-500 text-xs mt-1 font-medium">
            {project.visibility === 'private' ? 'Private' : 'Public'} • {project.members_count ?? 0} members
          </Text>

          <Text className="text-xs font-semibold text-gray-700 mt-2">
            Project Status :<Text className="text-primary-full uppercase"> {project.status} </Text>
          </Text>
        </View>

        {/* Dynamic Status Banner */}
        {project.status === 'PREPARATION' && (
          <View className="bg-primary-light border border-primary-full p-4 mb-6 flex-row items-center rounded-2xl gap-3">
            <View className="bg-primary-mid p-2 rounded-full">
              <Feather name="clock" size={20} color="#FF8C69" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-sm">Preparation Phase</Text>
              <Text className="text-xs mt-1">
                Execution locked for 7 days. Team is getting ready.
              </Text>
            </View>
          </View>
        )}

        {project.status === 'IN_PROGRESS' && (
          <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
            <View className="bg-emerald-100 p-2 rounded-full">
              <Feather name="play-circle" size={20} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-emerald-800 font-bold text-sm">Project is Live</Text>
              <Text className="text-emerald-600 text-xs mt-1">
                Roles and core goals are now locked.
              </Text>
            </View>
          </View>
        )}

        {/* Project Overview */}
        <Text className="text-lg font-bold text-text-title mb-3">Project Overview</Text>
        <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-slate-50">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="flex-1 text-sm text-gray-700 leading-6 mr-2">
              {project.description}
            </Text>
            {/* {userRole == 'owner' && (
              <TouchableOpacity onPress={onEditOverview}>
                <Text className="text-xs font-semibold text-primary-full">Edit</Text>
              </TouchableOpacity>
            )} */}
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap items-center gap-2 mt-4">
            {(project.tags || ['React Native', 'Expo', 'node.js']).map((tag, idx) => (
              <View key={idx} className="bg-slate-100 px-3 py-1.5 rounded-xl">
                <Text className="text-xs text-slate-600 font-medium">{tag}</Text>
              </View>
            ))}
            {/* {userRole == 'owner' && (
              <TouchableOpacity onPress={onAddTag} className="px-2 py-1.5">
                <Text className="text-xs font-semibold text-primary-full">+ Add</Text>
              </TouchableOpacity>
            )} */}
          </View>
        </View>

        {/* Current Members Section */}
        <View className="mt-6 mb-8">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
            CURRENT MEMBERS ({project.members?.length ?? 0})
          </Text>
          <View className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
            {project.members?.map((member, index) => (
              <TouchableOpacity
                onPress={() => handleUserProfilePress(member.id)}
                key={member.id}
                className="flex-row items-center justify-between p-3 border-b border-gray-50"
              >
                <View className="flex-row items-center gap-3 flex-1 mr-2">
                  {member.profile_image ? (
                    <Image
                      source={{ uri: member.profile_image }}
                      className="w-10 h-10 rounded-full bg-slate-100"
                    />
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-slate-100 justify-center items-center border border-slate-200">
                      <Ionicons name="person" size={18} color="#94A3B8" />
                    </View>
                  )}

                  <View className="flex-1">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-bold text-text-title" numberOfLines={1}>
                        {member.full_name}
                      </Text>
                      {member.is_verified && (
                        <Ionicons name="checkmark-circle" size={12} color="#FF8C69" />
                      )}
                    </View>
                    <Text className="text-xs text-gray-400" numberOfLines={1}>
                      {member.role_title}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="p-2">
                  <Feather name="message-square" size={18} color="#FF8C69" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Open Roles */}
        <View className="mt-6 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text-title">Needed Roles</Text>
            <View className="bg-primary-light px-3 py-1 rounded-full">
              <Text className="text-primary-full text-xs font-bold">{project.open_roles?.length ?? 0} Openings</Text>
            </View>
          </View>
          {project?.open_roles?.map((role, index) => (
            <View
              key={index}
              className="bg-white p-4 rounded-2xl mb-3 shadow-sm flex-row items-center justify-between"
              style={{ borderLeftWidth: 5, borderLeftColor: "#FF8C69" }}
            >
              <View className="flex-1 pr-2">
                <Text className="text-sm font-bold text-[#1E3A47]">{role.title}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">
                  {project.visibility === 'private' ? 'Private' : 'Public'} • Open Role
                </Text>
              </View>

              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-primary-light items-center justify-center"
                activeOpacity={0.7}
                onPress={() => setSelectedRole(role)}
              >
                <Feather name="arrow-right" size={16} color="#FF8C69" />
              </TouchableOpacity>
            </View>
          ))}
          {project.open_roles?.length == 0 && (
            <View className="bg-white border border-dashed border-gray-200 p-4 rounded-xl items-center">
              <Text className="text-xs text-gray-400 font-medium">All roles have been filled.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Action Footer */}
      <View className="p-5 gap-3">
        {userRole === 'owner' && (
          <>
            {project.status === 'RECRUITING' && (
              <>
                <TouchableOpacity
                  onPress={() => setIsRoleModalVisible(true)}
                  className="bg-primary-mid py-4 rounded-full items-center border border-primary-full">
                  <Text className="text-text-title font-bold text-sm">Add new role</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: '/projects/[id]/manage-team',
                    params: { id: project.id }
                  })}
                  className="bg-gray-200 py-4 rounded-full items-center border border-gray-300">
                  <Text className="text-text-title font-bold text-sm">Manage team</Text>
                </TouchableOpacity>
              </>
            )}

            {project.status === 'PREPARATION' && (
              <TouchableOpacity
                onPress={onStartPress}
                disabled={isBusy}
                className="bg-primary-full py-4 rounded-full items-center shadow-sm">
                <Text className="text-white font-bold text-sm">
                  {isBusy ? 'Starting…' : 'Start Project Manually'}
                </Text>
              </TouchableOpacity>
            )}

            {project.status === 'IN_PROGRESS' && (
              <TouchableOpacity
                onPress={onRequestCompletionPress}
                className="bg-emerald-500 py-4 rounded-full items-center shadow-sm">
                <Text className="text-white font-bold text-sm">Request Completion</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {userRole === 'member' && (
          <>
            <TouchableOpacity
              onPress={() => Alert.alert(
                "Coming Soon",
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
              className="bg-gray-200 py-4 rounded-full items-center border border-gray-300">
              <Text className="text-text-title font-bold text-sm">View tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-primary-full py-4 rounded-full items-center flex-row justify-center gap-2 border border-primary-full">
              <Text className="text-white font-bold text-sm">Inter Group Chat</Text>
              <Feather name="send" size={16} color="white" />
            </TouchableOpacity>
          </>
        )}

        {userRole === 'viewer' && project.status === 'RECRUITING' && (
          <TouchableOpacity
            onPress={() => router.push(`/projects/${project.id}/apply` as any)}
            className="bg-primary-full py-4 rounded-full items-center flex-row justify-center gap-2">
            <Text className="text-white font-bold text-sm">Apply to Project</Text>
            <Feather name="send" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Add Role Modal */}
      <AddRoleModal
        visible={isRoleModalVisible}
        onClose={() => setIsRoleModalVisible(false)}
        projectId={project.id}
        onSave={handleSaveRole}
      />

      {/* Role Details Modal */}
      <Modal
        visible={!!selectedRole}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedRole(null)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center px-5"
          activeOpacity={1}
          onPress={() => setSelectedRole(null)}
        >
          <TouchableWithoutFeedback>
            <View className="w-full bg-white rounded-3xl p-5 shadow-xl border border-gray-100 gap-4">

              <View className="flex-row items-center justify-between border-b border-slate-100 pb-3">
                <View className="flex-row items-center gap-3 flex-1 mr-2">
                  <View className="w-10 h-10 bg-primary-mid items-center justify-center rounded-2xl">
                    <Feather name="briefcase" size={20} color="#FF8C69" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-bold text-text-title" numberOfLines={1}>
                      {selectedRole?.title}
                    </Text>
                    <Text className="text-xs text-slate-400">
                      {selectedRole?.commitment_type || 'Open Role'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedRole(null)}
                  className="p-1"
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {selectedRole?.description && (
                <View className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                  <Text className="text-xs font-bold text-slate-400 mb-1 tracking-wider uppercase">
                    Description
                  </Text>
                  <Text className="text-xs text-slate-600 leading-5">
                    {selectedRole.description}
                  </Text>
                </View>
              )}

              {selectedRole?.requirements && selectedRole.requirements.length > 0 && (
                <View>
                  <Text className="text-xs font-bold text-slate-400 mb-2 tracking-wider uppercase">
                    Requirements
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {selectedRole.requirements.map((req, idx) => (
                      <View key={idx} className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">
                        <Text className="text-xs text-slate-600 font-medium">• {req}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {userRole === 'viewer' && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="bg-primary-full py-3.5 rounded-full items-center mt-1 shadow-sm"
                  onPress={() => {
                    const roleId = selectedRole?.id;
                    setSelectedRole(null);
                    router.push({
                      pathname: `/projects/${project.id}/apply` as any,
                      params: { roleId }
                    });
                  }}
                >
                  <Text className="text-white font-bold text-sm">Apply for this Role</Text>
                </TouchableOpacity>
              )}

            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}  