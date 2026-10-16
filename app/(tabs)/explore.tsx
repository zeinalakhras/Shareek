import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import TeamCard from '../../components/TeamCard';
import ExploreProjectsCard from '../../components/ExploreProjectsCard';
import { getProjectFeed, getProjects } from '@/api/project/projectApi';
import type { ProjectSummary } from '@/api/project/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'findTeam' | 'exploreProjects';


const STATUS_OPTIONS: Array<{ label: string; value: string | null }> = [
  { label: 'All statuses', value: null },
  { label: 'Recruiting', value: 'RECRUITING' },
  { label: 'Preparation', value: 'PREPARATION' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];


const Explore = () => {

  const accessToken = useAuthStore((state) => state.accessToken);
  const profile = useAuthStore((state) => state.profile);

  const [activeTab, setActiveTab] = useState<TabType>('findTeam');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const [feedItems, setFeedItems] = useState<ProjectSummary[]>([]);
  const [completedItems, setCompletedItems] = useState<ProjectSummary[]>([]);
  const [results, setResults] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchNonce, setSearchNonce] = useState(0);

  const loadData = useCallback(async (mode: 'initial' | 'refresh') => {
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
      const [feedResponse, completedResponse] = await Promise.all([
        getProjectFeed(accessToken),
        getProjects(accessToken, { status: ['COMPLETED'], page: 1, per_page: 50 }),
      ]);

      setFeedItems(feedResponse.data ?? []);
      setCompletedItems(completedResponse.data?.items ?? []);
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Could not load projects.'));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      loadData('initial');
    }, [loadData])
  );

  useEffect(() => {
    if (!accessToken) return;

    const query = searchQuery.trim();
    if (!query && statusFilter === null) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);
    const timer = setTimeout(async () => {
      try {
        const response = await getProjects(accessToken, {
          q: query || undefined,
          status: statusFilter ? [statusFilter] : undefined,
          page: 1,
          per_page: 50,
        });
        if (!cancelled) setResults(response.data?.items ?? []);
      } catch (error) {
        if (!cancelled) {
          setSearchError(getApiErrorMessage(error, 'Could not search projects.'));
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [accessToken, searchQuery, statusFilter, searchNonce]);

  /** Back to the untouched two-tab view. */
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
  };

  // While a search/filter is active it overrides the tab content entirely.
  const isFiltering = searchQuery.trim() !== '' || statusFilter !== null;

  const handleViewDetails = (id: string) => {
    router.push({
      pathname: '/projects/[id]',
      params: { id },
    })
  };

  const data: ProjectSummary[] = isFiltering
    ? results
    : activeTab === 'findTeam'
      ? feedItems
      : completedItems;

  const retry = () => {
    loadData('initial');
    setSearchNonce((nonce) => nonce + 1);
  };

  const renderEmpty = () => {
    if (isLoading || isSearching) {
      return (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#FF8C69" />
        </View>
      );
    }

    const error = isFiltering ? searchError : loadError;
    if (error) {
      return (
        <View className="items-center justify-center py-20 px-4">
          <View className="w-16 h-16 rounded-full bg-rose-50 items-center justify-center mb-3">
            <Feather name="alert-circle" size={28} color="#FF5C55" />
          </View>
          <Text className="text-base font-bold text-slate-700 mb-1">Could not load</Text>
          <Text className="text-xs text-slate-400 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={retry}
            className="px-5 py-2 rounded-full bg-primary-full"
          >
            <Text className="text-xs font-bold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="items-center justify-center py-20 px-4">
        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
          <Ionicons name="search-outline" size={28} color="#94A3B8" />
        </View>
        <Text className="text-base font-bold text-slate-700 mb-1">
          {isFiltering
            ? 'No projects found'
            : activeTab === 'findTeam'
              ? 'No projects to join yet'
              : 'No completed projects yet'}
        </Text>
        <Text className="text-xs text-slate-400 text-center">
          {isFiltering
            ? 'Try different keywords, or clear the search and filter.'
            : activeTab === 'findTeam'
              ? 'Projects looking for teammates will show up here.'
              : 'Finished projects will show up here once they complete.'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2">
        <Text className="text-xl font-bold text-text-title">Explore</Text>
        <Image
          source={
            profile?.profile_image
              ? { uri: profile.profile_image }
              : require('../../assets/images/profile.png')
          }
          className="w-12 h-12 rounded-full border-2 border-primary-full"
          resizeMode='cover'
        />
      </View>

      {/* Flat list for automatic data processing */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData('refresh')}
            colors={['#FF8C69']}
          />
        }

        renderItem={({ item }) => {

          const showCompletedCard = isFiltering
            ? String(item.status).toUpperCase() === 'COMPLETED'
            : activeTab === 'exploreProjects';

          return showCompletedCard ? (
            <ExploreProjectsCard item={item} onViewDetails={handleViewDetails} />
          ) : (
            <TeamCard item={item} onViewDetails={handleViewDetails} />
          );
        }}

        ListHeaderComponent={
          <View>
            {/* Search and Filter Bar */}
            <View className="flex-row items-center mb-5">
              <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100">
                <Feather name="search" size={20} color="#94A0B8" />
                <TextInput
                  placeholder="Search projects, partners ,..."
                  placeholderTextColor="#94A0B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  className="flex-1 text-base ml-2 py-0"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    className="ml-2"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="x-circle" size={18} color="#94A0B8" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setFilterVisible(true)}
                className="bg-primary-full p-3.5 rounded-full ml-3 shadow-md relative"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="options-outline" size={20} color="white" />
                {statusFilter !== null && (
                  <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#22C55E] border border-white" />
                )}
              </TouchableOpacity>
            </View>

            {/* Tabs Toggle */}
            <View className="flex-row justify-between bg-transparent mb-6">
              <TouchableOpacity
                onPress={() => setActiveTab('findTeam')}
                className={`flex-1 py-3 rounded-full mr-2 items-center shadow-sm ${activeTab === 'findTeam' ? 'bg-primary-full' : 'bg-secondry-one'}`}
              >
                <Text className="text-white font-semibold text-base">Find Team</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('exploreProjects')}
                className={`flex-1 py-3 rounded-full ml-2 items-center shadow-sm ${activeTab === 'exploreProjects' ? 'bg-primary-full' : 'bg-secondry-one'}`}
              >
                <Text className="text-white font-semibold text-base">Explore Projects</Text>
              </TouchableOpacity>
            </View>

            {/* Search / filter results header */}
            {isFiltering ? (
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2 flex-1 mr-2">
                  <Text className="text-lg font-bold text-text-title">
                    Results <Text className="text-primary-full">{results.length}</Text>
                  </Text>
                  {statusFilter !== null && (
                    <View className="bg-primary-light px-2.5 py-1 rounded-full flex-row items-center gap-1">
                      <Text className="text-[11px] font-bold text-primary-full">
                        {STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setStatusFilter(null)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Feather name="x" size={12} color="#FF8C69" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={clearFilters}
                  className="flex-row items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <Feather name="x-circle" size={13} color="#6B7280" />
                  <Text className="text-xs text-gray-500 font-medium">Clear all</Text>
                </TouchableOpacity>
              </View>
            ) : (
              activeTab === 'findTeam' && (
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-text-title">
                    Recommended <Text className="text-primary-full">for you</Text>
                  </Text>
                  <View className="bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-xs text-gray-500 font-medium">
                      {feedItems.length} matches
                    </Text>
                  </View>
                </View>
              )
            )}
          </View>
        }

        ListEmptyComponent={renderEmpty()}
      />

      {/* Status filter — feeds `status` straight into GET /projects */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl px-5 pt-6 pb-8">
                <Text className="text-lg font-bold text-text-title">Filter by status</Text>
                <Text className="text-xs text-slate-400 mt-1 mb-2">
                  Choose which projects to retrieve
                </Text>

                {STATUS_OPTIONS.map((option) => {
                  const isSelected = statusFilter === option.value;
                  return (
                    <TouchableOpacity
                      key={option.label}
                      activeOpacity={0.7}
                      onPress={() => {
                        setStatusFilter(option.value);
                        setFilterVisible(false);
                      }}
                      className="flex-row items-center justify-between py-4 border-b border-slate-100"
                    >
                      <Text
                        className={`text-base ${isSelected ? 'text-primary-full font-bold' : 'text-slate-600'}`}
                      >
                        {option.label}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark-circle" size={20} color="#FF8C69" />
                      ) : (
                        <View className="w-5 h-5 rounded-full border-2 border-slate-200" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
}

export default Explore;