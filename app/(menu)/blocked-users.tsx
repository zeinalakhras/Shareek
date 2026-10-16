import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getBlockedUsers, unblockUser } from '@/api/moderation/moderationApi';
import type { UserSummary } from '@/api/moderation/types';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/apiError';

export default function BlockedUsersScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<string[]>([]);

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
        const response = await getBlockedUsers(accessToken);
        setUsers(response.data ?? []);
      } catch (error) {
        setLoadError(getApiErrorMessage(error, 'Could not load your blocked users.'));
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

  const setBusy = (id: string, busy: boolean) => {
    setBusyIds((current) => (busy ? [...current, id] : current.filter((x) => x !== id)));
  };

  const handleUnblock = (user: UserSummary) => {
    Alert.alert(
      'Unblock user',
      `Unblock ${user.full_name || 'this user'}? They will be able to see your projects again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            if (!accessToken || busyIds.includes(user.id)) return;

            setBusy(user.id, true);
            const previous = users;
            setUsers((current) => current.filter((item) => item.id !== user.id));

            try {
              await unblockUser(user.id, accessToken);
            } catch (error) {
              setUsers(previous);
              Alert.alert('Could not unblock', getApiErrorMessage(error, 'The user was not unblocked.'));
            } finally {
              setBusy(user.id, false);
            }
          },
        },
      ]
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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">Blocked Users</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
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
                <Ionicons name="shield-checkmark-outline" size={30} color="#FF8C69" />
              </View>
              <Text className="text-base font-bold text-slate-700 mb-1">No blocked users</Text>
              <Text className="text-xs text-slate-400 text-center">
                People you block will show up here, and you can unblock them at any time.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const isBusy = busyIds.includes(item.id);

          return (
            <View className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-slate-50 flex-row items-center">
              {item.profile_image ? (
                <Image
                  source={{ uri: item.profile_image }}
                  className="w-12 h-12 rounded-full mr-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mr-3">
                  <Ionicons name="person" size={22} color="#94A3B8" />
                </View>
              )}

              <View className="flex-1 mr-3">
                <Text className="text-base font-bold text-text-title" numberOfLines={1}>
                  {item.full_name || 'Unknown user'}
                </Text>
                <Text className="text-xs text-slate-400 font-medium" numberOfLines={1}>
                  {item.email}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleUnblock(item)}
                disabled={isBusy}
                activeOpacity={0.7}
                className="bg-primary-light px-4 py-2.5 rounded-full border border-primary-full"
              >
                <Text className="text-xs font-bold text-primary-full">
                  {isBusy ? 'Unblocking…' : 'Unblock'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}