import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_APPLICATIONS_RESPONSE } from '@/MockData/projectsMock2';

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

export default function MyRequestsScreen() {

  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'All' | RequestStatus>('All');
  const [refreshing, setRefreshing] = useState(false);

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

  const initialData: ProjectRequestItem[] = useMemo(() => {
    const statusMap: Record<string, RequestStatus> = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };

    return MOCK_APPLICATIONS_RESPONSE.data.items.map((item) => {
      const dateObj = new Date(item.created_at);
      const formattedDate = `Applied ${dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;

      return {
        id: item.id,
        projectId: item.project.id,
        projectTitle: item.project.name,
        roleTitle: item.role.name,
        appliedDate: formattedDate,
        status: statusMap[item.status] || 'Pending',
      };
    });
  }, []);

  const [requests, setRequests] = useState<ProjectRequestItem[]>(initialData);

  const filteredRequests = useMemo(() => {
    if (selectedTab === 'All') return requests;
    return requests.filter((item) => item.status === selectedTab);
  }, [requests, selectedTab]);

  const handleWithdrawPress = (requestId: string) => {
    Alert.alert('Withdraw Application', 'Are you sure you want to withdraw your application?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Withdraw',
        style: 'destructive',
        onPress: () => {
          setRequests((prev) => prev.filter((item) => item.id !== requestId));
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
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 500);
            }}
            colors={['#FF8C69']}
          />
        }
        ListEmptyComponent={
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
                <TouchableOpacity onPress={() => handleWithdrawPress(item.id)}>
                  <Text className="text-xs font-semibold text-slate-400">Withdraw</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}