import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/api/notification/notificationApi';
import type { Notification } from '@/api/notification/types';
import { getApiErrorMessage } from '@/utils/apiError';

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getNotificationConfig = (type: string) => {
  const normalized = type?.toLowerCase() ?? '';

  if (normalized.includes('support')) {
    return {
      icon: <FontAwesome6 name="headset" size={24} color="#FF8C69" />,
      bgColor: 'bg-[#FFF1EC]',
    };
  }
  if (normalized.includes('request') || normalized.includes('application') || normalized.includes('join')) {
    return {
      icon: <FontAwesome5 name="user" size={18} color="#4A60FF" />,
      bgColor: 'bg-[#EEF1FF]',
    };
  }
  if (normalized.includes('match') || normalized.includes('project')) {
    return {
      icon: <Ionicons name="briefcase-outline" size={20} color="#E28743" />,
      bgColor: 'bg-[#FDF2EC]',
    };
  }
  if (normalized.includes('review') || normalized.includes('star') || normalized.includes('completion')) {
    return {
      icon: <Feather name="star" size={20} color="#A3A3A3" />,
      bgColor: 'bg-[#F5F5F5]',
    };
  }
  return {
    icon: <Feather name="bell" size={20} color="#FF8C69" />,
    bgColor: 'bg-[#FFF1EC]',
  };
};

const Notifications = () => {

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [items, setItems] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const unreadCount = items.filter((item) => !item.is_read).length;

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
      const response = await getNotifications(accessToken, { page: 1, per_page: 50 });
      setItems(response.data?.items ?? []);
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'Could not load your notifications.'));
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

  const setBusy = (id: string, busy: boolean) => {
    setBusyIds((current) => (busy ? [...current, id] : current.filter((x) => x !== id)));
  };

  const handleMarkRead = async (id: string) => {
    if (!accessToken || busyIds.includes(id)) return;

    const previous = items;
    setBusy(id, true);
    setItems(items.map((item) => (item.id === id ? { ...item, is_read: true } : item)));

    try {
      await markNotificationAsRead(id, accessToken);
    } catch (error) {
      setItems(previous);
      Alert.alert('Could not update', getApiErrorMessage(error, 'The notification could not be marked as read.'));
    } finally {
      setBusy(id, false);
    }
  };

  const performDelete = async (id: string) => {
    if (!accessToken || busyIds.includes(id)) return;

    const previous = items;
    setBusy(id, true);
    setItems(items.filter((item) => item.id !== id));

    try {
      await deleteNotification(id, accessToken);
    } catch (error) {
      setItems(previous);
      Alert.alert('Could not delete', getApiErrorMessage(error, 'The notification could not be deleted.'));
    } finally {
      setBusy(id, false);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete notification', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => performDelete(id) },
    ]);
  };

  const handleMarkAllRead = async () => {
    if (!accessToken || isMarkingAll || unreadCount === 0) return;

    const previous = items;
    setIsMarkingAll(true);
    setItems(items.map((item) => ({ ...item, is_read: true })));

    try {
      await markAllNotificationsAsRead(accessToken);
    } catch (error) {
      setItems(previous);
      Alert.alert('Could not update', getApiErrorMessage(error, 'Notifications could not be marked as read.'));
    } finally {
      setIsMarkingAll(false);
    }
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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">Notifications</Text>
      </View>

      {/* Mark all as read */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <Text className="text-xs font-bold tracking-wider text-[#7A7A7A]">
          {unreadCount > 0 ? `${unreadCount} UNREAD` : 'ALL CAUGHT UP'}
        </Text>
        <TouchableOpacity
          onPress={handleMarkAllRead}
          disabled={isMarkingAll || unreadCount === 0}
          className="flex-row items-center px-4 py-2 rounded-full border border-primary-full bg-primary-light"
          style={{ opacity: unreadCount === 0 || isMarkingAll ? 0.5 : 1 }}
        >
          <Feather name="check-circle" size={15} color="#FF8C69" />
          <Text className="text-xs font-bold text-primary-full ml-1.5">Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData('refresh')}
            colors={['#FF8C69']}
            tintColor="#FF8C69"
          />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF8C69" className="my-10" />
        ) : loadError ? (
          <View className="items-center my-10">
            <Text className="text-secondry-red text-sm text-center mb-3">{loadError}</Text>
            <TouchableOpacity
              onPress={() => loadData('initial')}
              className="bg-primary-light border border-primary-mid px-4 py-2 rounded-full"
            >
              <Text className="text-primary-full font-semibold text-sm">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : items.length === 0 ? (
          <View className="items-center my-12">

            <Text className="text-gray-400 text-sm text-center">
              You're all caught up — no notifications yet.
            </Text>
          </View>
        ) : (
          <View className="gap-4 pb-10">

            {items.map((item) => {
              const config = getNotificationConfig(item.type);
              const isRead = item.is_read;
              const isBusy = busyIds.includes(item.id);

              return (
                <View
                  key={item.id}
                  className={`rounded-3xl p-4 border ${isRead ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100/40'}`}
                  style={
                    isRead
                      ? undefined
                      : {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 10,
                        elevation: 2,
                      }
                  }
                >
                  <View className="flex-row items-start">
                    {/* Notification Icon */}
                    <View className={`w-12 h-12 rounded-2xl items-center justify-center ${config.bgColor} ${isRead ? 'opacity-50' : ''}`}>
                      {config.icon}
                    </View>

                    <View className="flex-1 ml-4">
                      <View className="flex-row justify-between items-start w-full">
                        <View className="flex-row items-center flex-1 pr-2" style={{ gap: 6 }}>
                          {!isRead && <View className="w-2 h-2 rounded-full bg-primary-full" />}
                          <Text
                            className={`text-base font-bold flex-1 ${isRead ? 'text-gray-400' : 'text-text-title'}`}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <Text className={`text-xs font-medium pt-0.5 ${isRead ? 'text-gray-400' : 'text-primary-full'}`}>
                          {formatTime(item.created_at)}
                        </Text>
                      </View>

                      <Text className={`text-sm mt-1.5 leading-relaxed ${isRead ? 'text-gray-400' : 'text-secondry-one'}`}>
                        {item.message}
                      </Text>

                      {/* Actions */}
                      <View className="flex-row justify-end items-center mt-3" style={{ gap: 8 }}>
                        {!isRead && (
                          <TouchableOpacity
                            onPress={() => handleMarkRead(item.id)}
                            disabled={isBusy}
                            className="flex-row items-center bg-primary-light px-3 py-1.5 rounded-full border border-primary-mid"
                            style={{ gap: 4, opacity: isBusy ? 0.5 : 1 }}
                          >
                            <Feather name="check" size={14} color="#FF8C69" />
                            <Text className="text-xs font-bold text-primary-full">Mark as read</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => confirmDelete(item.id)}
                          disabled={isBusy}
                          className="flex-row items-center bg-white px-3 py-1.5 rounded-full border border-gray-200"
                          style={{ gap: 4, opacity: isBusy ? 0.5 : 1 }}
                        >
                          <Feather name="trash-2" size={14} color="#EF4444" />
                          <Text className="text-xs font-bold text-red-500">Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer */}
        <View className="items-center justify-center pb-8 pt-4 px-6 border-t border-gray-100/30">
          <View className="bg-primary-light p-4 rounded-full mb-3 shadow-inner">
            <FontAwesome5 name="bell" size={24} color="#FF8C69" solid />
          </View>
          <Text className="text-xs text-center text-[#7A7A7A] max-w-[280px] leading-normal font-medium">
            Note : Notifications are deleted 30 days after they are sent.
          </Text>
        </View>
      </ScrollView>

    </SafeAreaView>
  );

}


export default Notifications;

