import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SavedCard from '@/components/SavedCard';
import { ProjectSummaryDTO } from '@/types/types';
import { getSavedProjects, removeSavedProject } from '@/utils/savedProjects';

export default function SavedProjectsScreen() {
  const router = useRouter();
  const [savedProjects, setSavedProjects] = useState<ProjectSummaryDTO[]>(() => getSavedProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSavedProjects(getSavedProjects());
    }, [])
  );

  const handleRemoveSaved = (id: string, name: string) => {
    Alert.alert(
      'Remove Saved Project',
      `Are you sure you want to remove "${name}" from your saved projects?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSavedProjects(removeSavedProject(id));
          },
        },
      ]
    );
  };

  const filteredProjects = savedProjects.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const onRefresh = () => {
    setRefreshing(true);
    setSavedProjects(getSavedProjects());
    setRefreshing(false);
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
        <Text className="text-xl font-bold text-[#2D3748] ml-2">Saved</Text>
      </View>

      {/* Search Bar */}
      <View className='px-4'>
        {savedProjects.length > 0 && (
          <View className="flex-row items-center bg-white px-3 py-2.5 rounded-xl border border-gray-200 mb-4 shadow-sm">
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search saved projects..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-sm text-gray-800 p-0"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SavedCard project={item} onRemoveSaved={(id, name) => handleRemoveSaved(id, name)} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-16 px-4">
            <View className="w-16 h-16 bg-primary-light items-center justify-center rounded-full mb-3">
              <Ionicons name="bookmark-outline" size={32} color="#FF8C69" />
            </View>
            <Text className="text-base font-bold text-gray-800 mb-1">
              {searchQuery ? 'No matching projects' : 'No saved projects'}
            </Text>
            <Text className="text-xs text-gray-500 text-center max-w-[240px] leading-5">
              {searchQuery
                ? 'Try searching with another keyword or tag.'
                : 'Bookmark interesting projects to easily access them here later.'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}