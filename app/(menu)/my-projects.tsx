import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProjectCard from '../../components/ProjectCard';
import { getMyProjects } from '../../api/project/projectApi';
import type { ProjectSummary } from '../../api/project/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';

const MY_PROJECT_STATUSES = [
  'RECRUITING',
  'PREPARATION',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'SUSPENDED',
];

export default function MyProjectsScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      if (mode === 'initial') {
        setIsLoading(true);
      } else {
        setRefreshing(true);
      }
      setLoadError(null);

      try {
        const response = await getMyProjects(accessToken, {
          status: MY_PROJECT_STATUSES,
          page: 1,
          per_page: 50,
        });
        setProjects(response.data?.items ?? []);
      } catch (error) {
        setLoadError(getApiErrorMessage(error, 'Could not load your projects.'));
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken]
  );

  useFocusEffect(
    useCallback(() => {
      loadData('initial');
    }, [loadData])
  );

  return (
    <SafeAreaView className="flex-1 bg-bg">

      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-100/50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full"
        >
          <Feather name="arrow-left" size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#2D3748] ml-2">My Projects</Text>
      </View>

      {/* Content */}
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData('refresh')}
            colors={['#FF8C69']}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#FF8C69" />
            </View>
          ) : loadError ? (
            <View className="items-center justify-center py-20 px-4">
              <View className="w-16 h-16 rounded-full bg-rose-50 items-center justify-center mb-3">
                <Feather name="alert-circle" size={28} color="#FF5C55" />
              </View>
              <Text className="text-base font-bold text-slate-700 mb-1">Could not load</Text>
              <Text className="text-xs text-slate-400 text-center mb-4">{loadError}</Text>
              <TouchableOpacity
                onPress={() => loadData('initial')}
                className="px-5 py-2 rounded-full bg-primary-full"
              >
                <Text className="text-xs font-bold text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center justify-center py-20 px-4">
              <View className="w-16 h-16 rounded-full bg-primary-light items-center justify-center mb-3">
                <Feather name="folder" size={30} color="#FF8C69" />
              </View>
              <Text className="text-base font-bold text-slate-700 mb-1">No projects yet</Text>
              <Text className="text-xs text-slate-400 text-center">
                Projects you own or belong to will appear here.
              </Text>
            </View>
          )
        }
      />

    </SafeAreaView>
  );
}