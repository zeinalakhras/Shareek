import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Switch, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { getRoles } from '@/api/role/roleApi';
import { getSkills } from '@/api/skill/skillApi';
import { addRoleRequirement, createProjectRole } from '@/api/project/ProjectRole';
import type { Role } from '@/api/role/types';
import type { Skill } from '@/api/skill/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';

export interface RoleSkill {
  skillId: string;
  name: string;
  isRequired: boolean;
}

export interface RoleData {
  roleId: string;
  title: string;
  requiredCount: number;
  skills: RoleSkill[];
  description: string;
  isBeginnerFriendly: boolean;
}

interface AddRoleModalProps {
  visible: boolean;
  onClose: () => void;

  projectId?: string;
  onSave?: (role: RoleData) => Promise<boolean | void> | boolean | void;
  initialData?: RoleData | null;
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({ visible, onClose, projectId, onSave, initialData }) => {

  const accessToken = useAuthStore((state) => state.accessToken);

  const [catalogRoles, setCatalogRoles] = useState<Role[]>([]);
  const [catalogSkills, setCatalogSkills] = useState<Skill[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [roleId, setRoleId] = useState('');
  const [title, setTitle] = useState('');
  const [requiredCount, setRequiredCount] = useState(1);
  const [pickedSkills, setPickedSkills] = useState<RoleSkill[]>([]);
  const [description, setDescription] = useState('');
  const [isBeginnerFriendly, setIsBeginnerFriendly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCatalogs = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);

    try {
      const [rolesResponse, skillsResponse] = await Promise.all([getRoles(), getSkills()]);
      setCatalogRoles(rolesResponse.data ?? []);
      setCatalogSkills(skillsResponse.data ?? []);
    } catch (error) {
      setFetchError(getApiErrorMessage(error, 'Could not load roles and skills.'));
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      setRoleId(initialData.roleId);
      setTitle(initialData.title);
      setRequiredCount(initialData.requiredCount);
      setPickedSkills(initialData.skills);
      setDescription(initialData.description);
      setIsBeginnerFriendly(initialData.isBeginnerFriendly);
    } else {
      setRoleId('');
      setTitle('');
      setRequiredCount(1);
      setPickedSkills([]);
      setDescription('');
      setIsBeginnerFriendly(false);
    }

    fetchCatalogs();
  }, [visible, initialData, fetchCatalogs]);

  const toggleSkill = (skill: Skill) => {
    setPickedSkills((current) => {
      const exists = current.some((entry) => entry.skillId === skill.id);
      return exists
        ? current.filter((entry) => entry.skillId !== skill.id)
        : [...current, { skillId: skill.id, name: skill.name, isRequired: true }];
    });
  };

  const setSkillRequired = (skillId: string, isRequired: boolean) => {
    setPickedSkills((current) =>
      current.map((entry) => (entry.skillId === skillId ? { ...entry, isRequired } : entry))
    );
  };

  const canSubmit = roleId.trim().length > 0 && !isSaving && !isFetching;


  const handleDone = async () => {
    if (!canSubmit) return;

    const payload: RoleData = {
      roleId,
      title,
      requiredCount,
      skills: pickedSkills,
      description: description.trim(),
      isBeginnerFriendly,
    };

    setIsSaving(true);
    try {
      if (projectId && accessToken) {
        const created = await createProjectRole(projectId, accessToken, {
          roleId: payload.roleId,
          requiredCount: payload.requiredCount,
          description: payload.description,
        });

        await Promise.all(
          payload.skills.map((skill) =>
            addRoleRequirement(projectId, created.data.roleId, accessToken, {
              skillId: skill.skillId,
              isRequired: skill.isRequired,
              minProficiencyLevel: 1,
            })
          )
        );
      }

      const result = await onSave?.(payload);
      if (result === false) return;

      onClose();
    } catch (error) {
      Alert.alert('Could not add the role', getApiErrorMessage(error, 'The role could not be saved.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/40 justify-center items-center px-5"
      >
        {/* Backdrop Press to Close */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <View className="w-full bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[85%]">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            {/* Header */}
            <View className="flex-row items-center justify-between mb-5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-10 h-10 bg-primary-light justify-center items-center mr-3 rounded-2xl">
                  <Feather name="briefcase" size={18} color="#FF8C69" />
                </View>
                <Text className="text-base font-bold text-slate-800 tracking-wide">Add a role</Text>
              </View>

              <TouchableOpacity onPress={onClose} className="p-1">
                <Ionicons name="close" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Both catalogs are fetched once, every time the modal opens */}
            {isFetching && (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#FF8C69" />
                <Text className="text-xs text-slate-400 mt-3">Loading roles and skills…</Text>
              </View>
            )}

            {fetchError && (
              <View className="items-center py-6">
                <Text className="text-sm text-slate-500 text-center mb-3">{fetchError}</Text>
                <TouchableOpacity onPress={fetchCatalogs} className="px-5 py-2 rounded-full bg-primary-full">
                  <Text className="text-xs font-bold text-white">Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isFetching && !fetchError && (
              <>
                {/* Pick the seat from the role catalog — same as create-step2 */}
                <View className="mb-5">
                  <Text className="text-sm font-bold text-text-title mb-3">Role</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {catalogRoles.map((role) => (
                      <TouchableOpacity
                        key={role.id}
                        onPress={() => {
                          setRoleId(role.id);
                          setTitle(role.name);
                        }}
                        className={`px-3.5 py-2 rounded-full border ${roleId === role.id
                          ? 'bg-primary-full border-primary-full'
                          : 'bg-white border-slate-200'
                          }`}
                      >
                        <Text className={`text-xs font-semibold ${roleId === role.id ? 'text-white' : 'text-slate-600'}`}>
                          {role.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* How many seats does this role need? (1–10) */}
                <View className="mb-5">
                  <Text className="text-sm font-bold text-text-title mb-3">People needed</Text>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                      onPress={() => setRequiredCount((count) => Math.max(1, count - 1))}
                      className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center"
                    >
                      <Feather name="minus" size={18} color="#475569" />
                    </TouchableOpacity>

                    <View className="flex-1 h-11 rounded-2xl bg-slate-100 items-center justify-center">
                      <Text className="text-base font-bold text-text-title">{requiredCount}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => setRequiredCount((count) => Math.min(10, count + 1))}
                      className="w-11 h-11 rounded-2xl bg-primary-light items-center justify-center border border-primary-full"
                    >
                      <Feather name="plus" size={18} color="#FF8C69" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Skills Needed — each picked skill is Required or Optional */}
                <View className="mb-5">
                  <Text className="text-sm font-bold text-text-title mb-3">Skills Needed</Text>

                  {pickedSkills.length > 0 && (
                    <View className="gap-2 mb-3">
                      {pickedSkills.map((skill) => (
                        <View
                          key={skill.skillId}
                          className="flex-row items-center bg-primary-light border border-primary-full rounded-2xl px-3 py-2"
                        >
                          <Text
                            className="text-xs font-semibold text-primary-full flex-1 mr-2"
                            numberOfLines={1}
                          >
                            {skill.name}
                          </Text>

                          <View className="flex-row bg-white rounded-full p-0.5 mr-2">
                            {(['Required', 'Optional'] as const).map((label) => {
                              const isRequired = label === 'Required';
                              const isActive = skill.isRequired === isRequired;
                              return (
                                <TouchableOpacity
                                  key={label}
                                  onPress={() => setSkillRequired(skill.skillId, isRequired)}
                                  className={`px-2.5 py-1 rounded-full ${isActive ? 'bg-primary-full' : ''}`}
                                >
                                  <Text className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              const catalogSkill = catalogSkills.find((entry) => entry.id === skill.skillId);
                              if (catalogSkill) toggleSkill(catalogSkill);
                            }}
                          >
                            <Ionicons name="close" size={16} color="#FF8C69" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Remaining catalog skills, tap to add */}
                  <View className="flex-row flex-wrap gap-2">
                    {catalogSkills
                      .filter((skill) => !pickedSkills.some((entry) => entry.skillId === skill.id))
                      .map((skill) => (
                        <TouchableOpacity
                          key={skill.id}
                          onPress={() => toggleSkill(skill)}
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white"
                        >
                          <Text className="text-xs font-semibold text-slate-600">+ {skill.name}</Text>
                        </TouchableOpacity>
                      ))}
                    {catalogSkills.length === 0 && (
                      <Text className="text-xs text-slate-400">No skills available right now.</Text>
                    )}
                  </View>
                </View>

            {/* Role Description */}
            <View className="mb-5">
              <Text className="text-sm font-bold text-text-title mb-3">Role Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the responsibilities and what you are looking for in a candidate..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-slate-100/80 rounded-2xl p-4 text-xs text-slate-800 font-medium min-h-[90px]"
              />
            </View>

            {/* Divider Line */}
            <View className="h-[1px] bg-slate-100 mb-4" />

            {/* Beginner Friendly Toggle */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1 mr-3">
                <Text className="text-sm font-bold text-slate-900">Beginner Friendly</Text>
                <Text className="text-xs text-slate-400 font-medium mt-0.5">
                  Is this role suitable for juniors?
                </Text>
              </View>
              <Switch
                value={isBeginnerFriendly}
                onValueChange={setIsBeginnerFriendly}
                trackColor={{ false: '#E2E8F0', true: '#FF8C69' }}
                thumbColor="#FFFFFF"
              />
            </View>

                {/* Action Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleDone}
                  disabled={!canSubmit}
                  className={`w-full py-3.5 rounded-full items-center shadow-md ${canSubmit ? 'bg-primary-full active:opacity-90' : 'bg-slate-200'}`}
                >
                  <Text className={`font-bold text-base ${canSubmit ? 'text-white' : 'text-slate-400'}`}>
                    {isSaving ? 'Saving…' : 'Add Role'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};