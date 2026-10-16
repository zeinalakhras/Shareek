import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationSuccessModal } from './ApplicationSuccessModal'
import { Project } from '@/types/project';

export interface ApplyFormData {
  whyJoin: string;
  skills: string[];
  roleId: string;
  role: string;
}

interface ApplyToJoinViewProps {
  project: Pick<Project, 'name' | 'visibility' | 'members_count' | 'open_roles'>;
  initialRoleId?: string;
  onSubmit?: (data: ApplyFormData) => Promise<boolean | void> | boolean | void;
  onCancel?: () => void;
}

const ApplyToJoinView: React.FC<ApplyToJoinViewProps> = ({
  project,
  initialRoleId,
  onSubmit,
  onCancel,
}) => {
  const router = useRouter();

  const [whyJoin, setWhyJoin] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoleId ?? '');
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRole = project.open_roles?.find((role) => role.id === selectedRoleId);

  const resetForm = () => {
    setWhyJoin('');
    setSkillsInput('');
    setSelectedRoleId('');
  };

  const handleSubmit = async () => {
    if (!selectedRole || !whyJoin.trim() || isSubmitting) return;

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setIsSubmitting(true);
    const result = await onSubmit?.({
      whyJoin,
      skills: skillsArray,
      roleId: selectedRole.id,
      role: selectedRole.title,
    });
    setIsSubmitting(false);

    if (result === false) return;

    setIsSuccessOpen(true);
    resetForm();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Back Button */}
        <View className="px-5 pt-3 pb-2">
          <TouchableOpacity
            onPress={onCancel || (() => router.back())}
            className="w-10 h-10 rounded-full bg-white justify-center items-center shadow-sm border border-slate-100"
          >
            <Ionicons name="arrow-back" size={20} color="#FF8C69" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >

          {/* Header */}
          <View className="items-center mt-2 mb-4">
            <View className="relative">
              <View className="w-20 h-20 rounded-full bg-primary-full justify-center items-center shadow-md border-4 border-white">
                <Text className="text-3xl font-extrabold text-white">S</Text>
              </View>
              <View className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white justify-center items-center shadow-sm">
                <Ionicons name="checkmark" size={14} color="#FFF" />
              </View>
            </View>

            <Text className="text-2xl font-extrabold text-text-title mt-4 text-center">Apply to join</Text>
            <Text className="text-2xl font-black text-primary-full text-center mb-1">{project.name}</Text>
            <Text className="text-xs font-semibold text-secondry-text text-center">
              {project.visibility === 'private' ? 'Private' : 'Public'} • {project.members_count ?? 0} members
            </Text>

          </View>

          {/* Join Request Message */}
          <View className="mb-5">
            <Text className="text-sm font-bold text-text-title mb-2">Why do you want to join?</Text>
            <View className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm relative min-h-[110px]">
              <TextInput
                value={whyJoin}
                onChangeText={setWhyJoin}
                placeholder="Tell us a bit about why this project excites you..."
                placeholderTextColor="#C5B7B1"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="flex-1 text-sm text-slate-800 p-0 pr-6"
              />
              <View className="absolute bottom-3 right-3">
                <Feather name="edit-3" size={16} color="#FF8C69" />
              </View>
            </View>
          </View>

          {/* Relevant Skills */}
          <View className="mb-5">
            <Text className="text-sm font-bold text-text-title mb-2">Your relevant skills</Text>
            <View className="flex-row items-center bg-white rounded-full border border-slate-100 px-4 py-3 shadow-sm">
              <TextInput
                value={skillsInput}
                onChangeText={setSkillsInput}
                placeholder="e.g. React, UX Design, Data Analysis..."
                placeholderTextColor="#C4B4A7"
                className="flex-1 text-sm text-slate-800 p-0"
              />
              <MaterialCommunityIcons name="head-lightbulb-outline" size={20} color="#FF8C69" />
            </View>
          </View>

          {/* Role Selection Dropdown */}
          <View className="mb-8">
            <Text className="text-sm font-bold text-text-title mb-2">Role Selection</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsRolePickerOpen(!isRolePickerOpen)}
              className="flex-row items-center justify-between bg-white rounded-full border border-slate-100 px-5 py-3.5 shadow-sm"
            >
              <Text
                className={`text-sm font-semibold ${selectedRole ? 'text-primary-full' : 'text-secondry-text'
                  }`}
              >
                {selectedRole?.title || 'Select the role you are applying for'}
              </Text>
              <Feather
                name={isRolePickerOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#FF8C69"
              />
            </TouchableOpacity>

            {/* Dropdown Options Menu */}
            {isRolePickerOpen && (
              <View className="bg-white border border-slate-100 rounded-2xl mt-2 p-2 shadow-md">
                {project.open_roles && project.open_roles.length > 0 ? (
                  project.open_roles.map((role) => (
                    <TouchableOpacity
                      key={role.id}
                      onPress={() => {
                        setSelectedRoleId(role.id);
                        setIsRolePickerOpen(false);
                      }}
                      className={`p-3 rounded-xl ${selectedRole?.id === role.id ? 'bg-primary-light' : 'active:bg-slate-50'
                        }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${selectedRole?.id === role.id ? 'text-primary-full' : 'text-secondry-text'
                          }`}
                      >
                        {role.title}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="p-3 text-sm font-semibold text-secondry-text text-center">
                    No open roles available for this project
                  </Text>
                )
                }
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary-full py-4 rounded-full flex-row items-center justify-center shadow-md active:opacity-90 mb-4"
            >
              <Text className="text-white font-bold text-base mr-2">
                {isSubmitting ? 'Submitting…' : 'Submit Application'}
              </Text>
              <Feather name="send" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel || (() => router.back())}
              className="py-2 items-center"
            >
              <Text className="text-sm font-bold text-secondry-text">Cancel</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>


      <ApplicationSuccessModal
        visible={isSuccessOpen}
        projectName={project.name}
        onClose={() => {
          setIsSuccessOpen(false);
          router.back();
        }}
        onBackToExplore={() => {
          setIsSuccessOpen(false);
          router.replace('/(tabs)/explore' as any);
        }}
        onViewApplications={() => {
          setIsSuccessOpen(false);
          router.replace('/my-requests' as any);
        }}
      />

    </SafeAreaView>
  );
};

export default ApplyToJoinView;