import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import ProjectCard from '@/components/ProjectCard'
import { router } from 'expo-router'
import SideMenu from '@/components/SideMenu'
import { getMyProjects } from '@/api/project/projectApi'
import type { ProjectSummary } from '@/api/project/types'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { getApiErrorMessage } from '@/utils/apiError'

const Home = () => {

  const [menuVisible, setMenuVisible] = useState(false);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { refreshProfile } = useAuth();

  const stats = profile?.stats;

  const fetchProjects = useCallback(async () => {
    if (!accessToken) return;

    const response = await getMyProjects(accessToken);
    setProjects(response.data?.items ?? []);
  }, [accessToken]);

  const loadData = useCallback(async (mode: 'initial' | 'refresh') => {
    if (mode === 'initial') {
      setIsLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      await Promise.all([refreshProfile(), fetchProjects()]);
    } catch (error) {
      Alert.alert('Could not load', getApiErrorMessage(error, 'Something went wrong while loading your home feed.'));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [refreshProfile, fetchProjects]);

  useEffect(() => {
    loadData('initial');
  }, [loadData]);


  return (
    <SafeAreaView className='bg-bg flex-1'>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} />
        )}
        refreshing={refreshing}
        onRefresh={() => loadData('refresh')}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#FF8C69" className="my-10" />
          ) : (
            <Text className="text-center text-text-placeholder my-10">
              No projects yet. Start one to see it here.
            </Text>
          )
        }

        ListHeaderComponent={
          <View>
          {/*Header*/}
          <View className='flex-row justify-between items-center mx-4' style={{marginVertical:20}}>
            <View className="flex-row items-center gap-2">
              <Image 
              source={require('../../assets/images/icon-outline.png')}
              className="w-12 h-12"
              resizeMode="cover"
              />
              <Text className="text-2xl font-bold">Shareek</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity
               onPress={()=>{router.push('/notifications')}}
               >
                <Ionicons name="notifications-sharp" size={35} color="#FF8C69" />
              </TouchableOpacity>
              <TouchableOpacity 
               onPress={() => setMenuVisible(true)}
               >
                <Ionicons name="menu" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {/*Cards*/}
          <View className='flex-row px-4' style={{gap:16, marginVertical:20}}>
            <View className='flex-1 bg-primary-light border border-primary-full rounded-2xl p-5 items-center justify-center gap-2'>
              <AntDesign name="appstore-add" size={24} color="#FF8C69" />
              <Text className='text-lg font-semibold text-primary-full'>{stats?.projects_created ?? 0}</Text>
            </View>
            <View className='flex-1 bg-primary-light border border-primary-full rounded-2xl p-5 items-center justify-center gap-2'>
              <AntDesign name="star" size={24} color="#FF8C69" />
              <Text className='text-lg font-semibold text-primary-full'>{stats?.stars_received ?? 0}</Text>
            </View>
            <View className='flex-1 bg-primary-light border border-primary-full rounded-2xl p-5 items-center justify-center gap-2'>
              <Ionicons name="people" size={24} color="#FF8C69" />
              <Text className='text-lg font-semibold text-primary-full'>{stats?.projects_joined ?? 0}</Text>
            </View>
          </View>
          {/*Buttons*/}
          <View className='items-center' style={{marginVertical:20}}>
            <Text className='text-sm'>Do you want to do something new today?</Text>
             <CustomButton width='80%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Start a Project" titleColor='#fff' handelPress={()=>{router.push('/create/create-step1')}} />
             <CustomButton width='80%' borderColor='#FF8C69' height={50} bgColor='#F8F6F5' title="Find a Team" titleColor='#FF8C69' handelPress={()=>{router.push('/(tabs)/explore')}} />
          </View>
          {/**/}
          <View className='mx-4 mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-xl font-bold text-text-title'>Recently</Text>
            </View>
            <TouchableOpacity
              className='flex-row items-center gap-1'
              activeOpacity={0.7}
              onPress={() => router.push('/(menu)/my-projects')}
            >
              <Text className='text-base font-semibold text-primary-full'>View all</Text>
              <Ionicons name="chevron-forward" size={16} color="#FF8C69" />
            </TouchableOpacity>
          </View>

          <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

        </View>
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default Home