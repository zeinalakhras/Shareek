import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleProgressBar from '@/components/SimpleProgressBar';
import CustomButton from '@/components/CustomButton';
import { getRoles } from '@/api/role/roleApi';
import { createProject } from '@/api/project/projectApi';
import type { Role } from '@/api/role/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';


const Create = () => {

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isFetchingRoles, setIsFetchingRoles] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAllRoles, setShowAllRoles] = useState(false);

  const fetchRoles = useCallback(async () => {
    setIsFetchingRoles(true);
    setRolesError(null);

    try {
      const response = await getRoles();
      setRoles(response.data ?? []);
    } catch (error) {
      setRolesError(getApiErrorMessage(error, 'Could not load roles. Please try again.'));
    } finally {
      setIsFetchingRoles(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId]
    );
  };

  const handleNextStep = async () => {
    if (!projectName.trim()) {
      Alert.alert('Project name required', 'Give your project a name before continuing.');
      return;
    }

    if (!accessToken) {
      Alert.alert('Session expired', 'Your session has expired. Please sign in again to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createProject(accessToken, {
        name: projectName.trim(),
        description: projectDescription.trim(),
        visibility: 'public',
      });

      const selectedRoles = roles
        .filter((role) => selectedRoleIds.includes(role.id))
        .map((role) => ({ id: role.id, name: role.name }));

      router.push({
        pathname: '/create/create-step2',
        params: {
          projectId: response.data.id,
          selectedRoles: JSON.stringify(selectedRoles),
        },
      });
    } catch (error) {
      Alert.alert('Could not create project', getApiErrorMessage(error, 'Something went wrong while creating your project.'));
    } finally {
      setIsSubmitting(false);
    }
  };


  const displayedRoles = showAllRoles ? roles : roles.slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/home')}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-50"
        >
          <Feather name="arrow-left" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-title">Create Project</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ProgressBar */}
        <SimpleProgressBar stepNumber={1} stepCount={3} />

        {/* Main Titles */}
        <Text className="text-2xl font-extrabold text-text-title leading-8 mb-1.5">Let's start with the basics.</Text>
        <Text className="text-base text-[#A38F85] mb-7">Tell us a bit about your idea.</Text>

        {/* Project Name */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-text-title mb-2.5">Project Name</Text>
          <TextInput
            className="bg-white rounded-3xl px-5 py-4 text-base text-text-title border border-[#FFF1EC] shadow-sm"
            placeholder="e.g., AI Study Buddy"
            placeholderTextColor="#C5B7B1"
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        {/* Project Description */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-text-title mb-2.5">Project Description</Text>
          <TextInput
            className="bg-white rounded-2xl px-5 py-4 text-base text-text-title border border-[#FFF1EC] shadow-sm h-[120px]"
            placeholder="Briefly describe what you want to build..."
            placeholderTextColor="#C5B7B1"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={projectDescription}
            onChangeText={setProjectDescription}
          />
        </View>

        {/* Required Specializations — fetched from the backend */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-bold text-text-title">Who do you need?</Text>
        </View>

        {isFetchingRoles ? (
          <ActivityIndicator size="small" color="#FF8C69" className="mb-10" />
        ) : rolesError ? (
          <View className="mb-10 items-center">
            <Text className="text-secondry-red text-sm text-center mb-3">{rolesError}</Text>
            <TouchableOpacity
              onPress={fetchRoles}
              className="bg-primary-light border border-primary-mid px-4 py-2 rounded-full"
            >
              <Text className="text-primary-full font-semibold text-sm">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-2.5 mb-10 items-center">
            {roles.length === 0 && (
              <Text className="text-text-placeholder text-sm">No roles available right now.</Text>
            )}
            {displayedRoles.map((role) => {
              const isSelected = selectedRoleIds.includes(role.id);
              return (
                <TouchableOpacity
                  key={role.id}
                  className={`flex-row items-center rounded-full px-3.5 py-2.5 border ${isSelected ? 'bg-primary-full border-primary-full' : 'bg-white border-[#EFEAE6]'
                    }`}
                  onPress={() => toggleRole(role.id)}
                >
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={isSelected ? '#FFF' : '#A38F85'}
                    className="mr-1.5"
                  />
                  <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-[#A38F85]'}`}>
                    {role.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {roles.length > 5 && (
              <TouchableOpacity
                onPress={() => setShowAllRoles(!showAllRoles)}
                className="self-start rounded-full px-3.5 py-2.5 border bg-primary-full border-primary-full"
              >
                <Text className="text-white font-bold text-sm">
                  {showAllRoles ? 'show less' : `show more (${roles.length - 5})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Next Step Button */}
        <CustomButton width="100%" borderColor='#FF8C65' height={50} bgColor='#FF8C65' title='Next Step' titleColor='#fff'
          isLoading={isSubmitting}
          handelPress={handleNextStep} />

      </ScrollView>
    </SafeAreaView>
  );
}


export default Create;

