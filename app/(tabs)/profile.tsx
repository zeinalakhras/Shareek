import { ActivityIndicator, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import ProjectCard from '@/components/ProjectCard'
import { router, useFocusEffect } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { getMyProjects } from '@/api/project/projectApi'
import type { ProjectSummary } from '@/api/project/types'

const SKILL_DOT_COLORS = ['#38BDF8', '#FF8C69', '#0284C7', '#3178C6', '#8B5CF6', '#10B981'];

const LinkItem = ({ label, value, iconName, IconComponent }: any) => (
  <View className="mb-4 w-full">
    <Text className="text-sm font-semibold text-text-title mb-2 ml-1">{label}</Text>
    <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm justify-between">
      <View className="flex-row items-center flex-1">
        <IconComponent name={iconName} size={18} color="#FF8C69" />
        <Text className="text-gray-400 text-sm ml-3 bg-transparent flex-1" numberOfLines={1}>{value}</Text>
      </View>
      <Feather name="external-link" size={18} color="#FF8C69" />
    </View>
  </View>
);

const SkillBadge = ({ label, dotColor }: any) => (
  <View className="flex-row items-center bg-white border border-gray-100 rounded-full px-4 py-2 mr-2.5 shadow-sm">
    <View style={{ backgroundColor: dotColor }} className="w-2.5 h-2.5 rounded-full mr-2" />
    <Text className="text-gray-700 font-medium text-sm">{label}</Text>
  </View>
);

const Profile = () => {

  const tabBarHeight = useBottomTabBarHeight();

  const { profile, refreshProfile } = useAuth();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [currentProjects, setCurrentProjects] = useState<ProjectSummary[]>([]);
  const [completedProjects, setCompletedProjects] = useState<ProjectSummary[]>([]);
  const [areProjectsLoading, setAreProjectsLoading] = useState(true);

  /**
   * Two requests to `/projects/me`, each filtered to the statuses that belong
   * in its section. They are independent, so they go out together.
   */
  const fetchProjects = useCallback(async () => {
    if (!accessToken) {
      setAreProjectsLoading(false);
      return;
    }

    setAreProjectsLoading(true);

    try {
      const [current, completed] = await Promise.all([
        getMyProjects(accessToken, { status: ['RECRUITING', 'PREPARATION', 'IN_PROGRESS'] }),
        getMyProjects(accessToken, { status: ['COMPLETED'] }),
      ]);

      setCurrentProjects(current.data?.items ?? []);
      setCompletedProjects(completed.data?.items ?? []);
    } catch {
    } finally {
      setAreProjectsLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      refreshProfile().catch(() => {
      });
      fetchProjects();
    }, [refreshProfile, fetchProjects])
  );

  const fullName = profile?.full_name || 'Your profile';
  const membership = profile?.is_student
    ? (profile.university?.name || 'University Student')
    : (profile?.major || 'Member');
  const skills = profile?.skills ?? [];


  return (
    <SafeAreaView className='bg-bg'>
      <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: tabBarHeight }}>
        <View>
          {/*photo && name section*/}
          <View className='items-center p-8 pb-4' style={{ gap: 15 }}>
            {/* Plain circle with the same thin border as the sidebar avatar — no glow. */}
            <View className='w-32 h-32 rounded-full overflow-hidden border-2 border-primary-full'>
              <Image
                source={
                  profile?.profile_image
                    ? { uri: profile.profile_image }
                    : require('../../assets/images/profile.png')
                }
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
            <View>
              <View className="flex-row items-center justify-center gap-1.5">
                <Text className='font-semibold text-2xl text-center'>{fullName}</Text>
                {/* Orange check marks the signed-in account as verified */}
                {profile?.is_verified && (
                  <Ionicons name="checkmark-circle" size={20} color="#FF8C69" />
                )}
              </View>
              <View className="bg-primary-light border border-primary-mid items-center px-4 py-1 rounded-full mt-2">
                <Text className="text-primary-full font-medium text-xs">{membership}</Text>
              </View>
              {profile?.id ? (
                <Text className="text-gray-500 text-center text-xs mt-2 font-medium tracking-wide">ID: {profile.id}</Text>
              ) : null}
              {/* Telegram handle is set by an admin in the DB, so it is display-only */}
              {profile?.telegram_username ? (
                <View className="flex-row items-center justify-center gap-1 mt-1">
                  <Ionicons name="paper-plane-outline" size={12} color="#94A3B8" />
                  <Text className="text-gray-500 text-center text-xs font-medium tracking-wide">
                    {profile.telegram_username}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {/*Edit Button*/}
          <View className='px-6'>
            <TouchableOpacity
              onPress={()=>{router.push('/profile/edit-profile')}}
              className='flex-row justify-center items-center gap-2 bg-black rounded-full p-3'
            >
              <Entypo name="edit" size={16} color="white" />
              <Text className='text-white'>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          {/*Bio Section*/}
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-text-title mb-2">Bio</Text>
            <Text className="text-gray-600 leading-6 text-sm">
              {profile?.bio || 'No bio yet. Tell people what you like to build.'}
            </Text>
          </View>
          {/*Links Section*/}
          <View className="px-6 mt-6">
            <LinkItem
              label="Github Account"
              value={profile?.github_url || 'Not added yet'}
              iconName="code"
              IconComponent={Feather}
            />
            <LinkItem
              label="Portfolio"
              value={profile?.portfolio_url || 'Not added yet'}
              iconName="globe"
              IconComponent={Feather}
            />
            <LinkItem
              label="Linkedin"
              value={profile?.linkedin_url || 'Not added yet'}
              iconName="linkedin"
              IconComponent={FontAwesome5}
            />
          </View>
          {/*About me button*/}
          <View className="px-6 mt-2">
            <TouchableOpacity
              onPress={() => { router.push('/profile/additional-info') }}
              className="flex-row items-center justify-between bg-primary-full/20 border border-primary-full rounded-3xl px-5 py-4 active:opacity-90">
              <View className="flex-row items-center">
                <Feather name="info" size={20} color="#FF8C69" />
                <Text className="text-primary-full font-bold text-base ml-3">About me</Text>
              </View>
              <Feather name="arrow-right" size={20} color="#FF8C69" />
            </TouchableOpacity>
          </View>
          {/*Skills*/}
          <View className="mt-6 px-6">
            <Text className="text-sm font-bold text-text-title tracking-wider mb-3">SKILLS</Text>
            {skills.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pr-6">
                {skills.map((skill, index) => (
                  <SkillBadge
                    key={skill.id}
                    label={skill.name}
                    dotColor={SKILL_DOT_COLORS[index % SKILL_DOT_COLORS.length]}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text className="text-gray-400 text-sm">No skills added yet.</Text>
            )}
          </View>
          {/*Current Projects*/}
          <View className='mt-6'>
            <View className="flex-row justify-between items-center mb-4 px-5">
              <Text className="text-2xl font-bold text-text-title">Current Projects</Text>
            </View>
            <View className='px-6'>
              {areProjectsLoading ? (
                <ActivityIndicator size='small' color='#FF8C69' className='my-4' />
              ) : currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <Text className='text-gray-400 text-sm text-center my-4'>
                  No current projects yet.
                </Text>
              )}
            </View>
          </View>
          {/*Completed Projects*/}
          <View className='mt-6'>
            <View className="px-5 mb-4">
              <Text className="text-2xl font-bold text-text-title">Completed</Text>
            </View>
            <View className='px-6'>
              {areProjectsLoading ? (
                <ActivityIndicator size='small' color='#FF8C69' className='my-4' />
              ) : completedProjects.length > 0 ? (
                completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <Text className='text-gray-400 text-sm text-center my-4'>
                  No completed projects yet.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

