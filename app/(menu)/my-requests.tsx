import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { deleteApplication, getApplications } from '@/api/application/applicationApi';
import type { GetApplicationsParams } from '@/api/application/types';
import { getApiErrorMessage } from '@/utils/apiError';

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface ProjectRequestItem {
  id: string;
  projectId: string;
  projectTitle: string;
  roleTitle?: string;
  appliedDate: string;
  status: RequestStatus;
}

const STATUS_CONFIG: Record<RequestStatus, { bg: string; text: string; icon?: string; iconColor?: string }> = {
  Pending: { bg: 'bg-primary-light', text: 'text-primary-full' },
  Accepted: { bg: 'bg-emerald-100/80', text: 'text-secondry-green', icon: 'checkmark-circle-outline' , iconColor: '#22C55E' },
  Rejected: { bg: 'bg-rose-100/80', text: 'text-secondry-red', icon: 'close-circle-outline' , iconColor: '#FF5C55' },
};

const TABS: Array<'All' | RequestStatus> = ['All', 'Pending', 'Accepted', 'Rejected'];


const TAB_TO_API_STATUS: Record<RequestStatus, string> = {
  Pending: 'PENDING',
  Accepted: 'ACCEPTED',
  Rejected: 'REJECTED',
};

const mapStatus = (raw: string): RequestStatus => {
  switch ((raw ?? '').toUpperCase()) {
    case 'ACCEPTED':
      return 'Accepted';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Pending';
  }
};

const formatAppliedDate = (appliedAt: string): string => {
  const date = new Date(appliedAt);
  if (Number.isNaN(date.getTime())) return 'Applied recently';
  return `Applied ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

export default function MyRequestsScreen() {

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [selectedTab, setSelectedTab] = useState<'All' | RequestStatus>('All');
  const [requests, setRequests] = useState<ProjectRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Application ids with a withdraw in flight — keeps double taps from firing twice.
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const didMount = useRef(false);
  const lastTab = useRef<'All' | RequestStatus>('All');

  const getEmptyStateContent = (tab: 'All' | RequestStatus) => {
      switch (tab) {
        case 'Pending':
          return {
            title: 'No Pending Requests',
            description: 'You don\'t have any applications waiting for response.',
          };
        case 'Accepted':
          return {
            title: 'No Accepted Requests',
            description: 'None of your project applications have been accepted yet.',
          };
        case 'Rejected':
          return {
            title: 'No Rejected Requests',
            description: 'Great news! You don\'t have any rejected applications.',
          };
        default:
          return {
            title: 'No Requests Found',
            description: 'You haven\'t applied to any projects yet.',
          };
      }
    };

  const loadData = useCallback(async (mode: 'initial' | 'refresh') => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    if (mode === 'initial') {
      setIsLoading(true);

      if (didMount.current && lastTab.current !== selectedTab) {
        setRequests([]);
      }
      lastTab.current = selectedTab;
    } else {
      setRefreshing(true);
    }
    setLoadError(null);

    try {
      const params: GetApplicationsParams =
        selectedTab === 'All'
          ? { page: 1, per_page: 50 }
          : { status: TAB_TO_API_STATUS[selectedTab], page: 1, per_page: 50 };

      const response = await getApplications(accessToken, params);
      const items = response.data?.items ?? [];
      setRequests(
        items.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          projectTitle: item.projectName || 'Untitled project',
          roleTitle: item.roleName || undefined,
          appliedDate: formatAppliedDate(item.appliedAt),
          status: mapStatus(item.status),
        }))
      );
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Could not load your applications.'));
    } finally {
      didMount.current = true;
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, selectedTab]);

  useFocusEffect(
    useCallback(() => {
      loadData('initial');
    }, [loadData])
  );

  const setBusy = (id: string, busy: boolean) => {
    setBusyIds((current) => (busy ? [...current, id] : current.filter((x) => x !== id)));
  };

  const handleWithdrawPress = (requestId: string) => {
    Alert.alert('Withdraw Application', 'Are you sure you want to withdraw your application?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Withdraw',
        style: 'destructive',
        onPress: async () => {
          if (!accessToken || busyIds.includes(requestId)) return;
          setBusy(requestId, true);
          const previous = requests;
          setRequests((prev) => prev.filter((item) => item.id !== requestId));
          try {
            await deleteApplication(requestId, accessToken);
          } catch (error) {
            setRequests(previous);
            Alert.alert('Withdraw failed', getApiErrorMessage(error, 'Could not withdraw your application.'));
          } finally {
            setBusy(requestId, false);
          }
        },
      },
    ]);
  };

  const renderStatusBadge = (status: RequestStatus) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
      <View className={`flex-row items-center px-3 py-1.5 rounded-full ${config.bg}`}>
        {config.icon ? (
          <Ionicons name={config.icon as any} size={14} className="mr-1" color={config.iconColor} />
        ) : (
          <View className="w-2 h-2 bg-primary-full mr-1.5 rounded-full" />
        )}
        <Text className={`text-xs font-bold ${config.text}`}>{status}</Text>
      </View>
    );
  };

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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">My Requests</Text>
      </View>

      {/* Filter Tabs */}
      <View className="px-5 my-3">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TABS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(item)}
              className={`px-5 py-2 rounded-full mr-2 border ${selectedTab === item
                ? 'bg-primary-full border-primary-full'
                : 'bg-white border-slate-100'
                }`}
            >
              <Text
                className={`text-xs font-bold ${selectedTab === item ? 'text-white' : 'text-slate-500'
                  }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Main List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
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
              <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
                <Ionicons name="document-text-outline" size={28} color="#94A3B8" />
              </View>
              <Text className="text-base font-bold text-slate-700 mb-1">
                {getEmptyStateContent(selectedTab).title}
              </Text>
              <Text className="text-xs text-slate-400 text-center">
                {getEmptyStateContent(selectedTab).description}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              {renderStatusBadge(item.status)}
              <View className="w-10 h-10 bg-slate-50 rounded-2xl justify-center items-center">
                <Ionicons name="leaf-outline" size={20} color="#94A3B8" />
              </View>
            </View>

            <Text className="text-lg font-extrabold text-text-title mb-1">
              {item.projectTitle}
            </Text>

            {item.roleTitle && (
              <Text className="text-xs font-semibold text-primary-full mb-2">
                Role: {item.roleTitle}
              </Text>
            )}

            <View className="flex-row items-center mb-4">
              <Feather name="calendar" size={14} color="#94A3B8" style={{ marginRight: 6 }} />
              <Text className="text-xs font-medium text-slate-400">{item.appliedDate}</Text>
            </View>

            <View className="h-[1px] bg-slate-100 w-full mb-4" />

            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.push(`/projects/${item.projectId}` as any)}
                className="flex-row items-center"
              >
                <Text className="text-sm font-bold text-primary-full mr-1">View Details</Text>
                <Feather name="arrow-right" size={16} color="#FF8C69" />
              </TouchableOpacity>

              {item.status === 'Pending' && (
                <TouchableOpacity
                  onPress={() => handleWithdrawPress(item.id)}
                  disabled={busyIds.includes(item.id)}
                >
                  <Text className="text-xs font-semibold text-slate-400">
                    {busyIds.includes(item.id) ? 'Withdrawing…' : 'Withdraw'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}